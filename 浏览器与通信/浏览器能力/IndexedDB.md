# IndexedDB

## 什么是IndexedDB？

IndexedDB 是浏览器中提供的 **本地 NoSQL 数据库存储**方案，具有：

| 特性         | 说明                                                         |
| ------------ | ------------------------------------------------------------ |
| 存储容量大   | 远超 localStorage（localStorage 5MB 左右，IndexedDB 理论可达上百 MB 甚至更大） |
| 异步读写     | 不会阻塞主线程性能更佳                                       |
| 支持索引     | 可快速查询数据，如 SQL 里的索引                              |
| 存储复杂对象 | 可存储对象、二进制数据（Blob 等）                            |
| 事务机制     | 保证数据一致性                                               |

适用于：**离线缓存、数据量大、结构化数据存储、持久化保存**

## 基本概念快速理解

| 概念         | 对应关系 | 类比（SQL） |
| ------------ | -------- | ----------- |
| Database     | 数据库   | Database    |
| Object Store | 对象仓库 | Table       |
| Record       | 记录     | Row         |
| Key          | 主键     | Primary Key |
| Index        | 索引     | Index       |

## 封装IndexedDB操作类

自定义类支持以下功能：

- 添加表
- 打开数据库
- 关闭数据库
- 删除数据库（根据名称）
- 清空某张表
- 清空所有表
- 添加一张表
- 查询表所有数据
- 条件查询
- 增加数据
- 删除数据
- 删除数据（通过主键）
- 修改数据（通过主键）
- 修改数据（表明+条件）
- 查询数据（通过主键）
- 查询数据（通过索引）
- 游标开启成功
- 开启事务（transaction）
- 创建表
- 创建索引

```javascript
const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
const isObject = data => Object.prototype.toString.call(data) === "[object Object]";
const isArray = data => Object.prototype.toString.call(data) === "[object Array]";
const log = msg => console.log('indexedDB打印:' + msg);
class Dep {
  constructor() {
    this.deps = [];
  }

  add(element) {
    this.deps.push(element);
  }

  notify() {
    for (let i = 0; i < this.deps.length; i++) {
      this.deps[i]();
    }
    this.deps.length = 0;
  }
}
class DB {
  constructor({dbName, version}) {
    this.dbName = dbName;
    this.version = version;
    this.db = null;
    this.idb = null;
    this.table = [];
    this._status = false; // 是否先添加了表
    this._dep_ = new Dep();
    this.cacheData = {};
    this.cacheDataLength = 900;
  }

  /**
   * 打开数据库
   * @success 成功的回调，返回db，非必传
   * @error 失败的回调，返回错误信息，非必传
   * */
  open(ops) {
    let success = () => {},
      error = () => {};

    if (ops) {
      success = ops.success ? ops.success : success;
      error = ops.error ? ops.error : error;
    }

    // 打开前要先添加表
    if (this.table.length == 0 && !this._status) {
      log("打开前要先用add_table添加表");
      return;
    }

    if (typeof success !== "function") {
      log("open中success必须是一个function类型");
      return;
    }

    const request = indexedDB.open(this.dbName, this.version);

    request.onerror = e => {
      error(e.currentTarget.error.message);
    };

    request.onsuccess = e => {
      this.db = e.target.result;
      success(this.db);
      this._dep_.notify();
    };

    request.onupgradeneeded = e => {
      this.idb = e.target.result;

      for (let i = 0; i < this.table.length; i++) {
        this.__create_table(this.idb, this.table[i]);
      }
    };
  }

  //  关闭数据库
  close_db() {
    const handler = () => {
      this.db.close();
    };

    this.__action(handler);
  }

  // 删除数据库
  delete_db(name) {
    this.cacheData = {};
    indexedDB.deleteDatabase(name);
  }

  // 清空某张表的数据
  clear_table({tableName, success = () => {}}) {
    this.cacheData[tableName] = {};
    this.__action(() => {
      this.__create_transaction(tableName, "readwrite").clear();
      success();
    });
  }

  // 清空所有表的数据
  clear_All_table(success = () => {}, error = () => {}) {
    let promissArr = [];
    let self = this;
    this.table.forEach((tableInfo) => {
      this.cacheData[tableInfo.tableName] = {};
      promissArr.push(new Promise((res, rej) => {
        self.__action(() => {
          let req = self.__create_transaction(tableInfo.tableName, "readwrite").clear();
          req.onsuccess = function(){
            res();
          };
          req.onerror = function(e){
            rej(e);
          };
        });
      }));
    });
    Promise.all(promissArr).then(() => {
      console.log('thrennn');
      success();
    }).catch((e) => {
      error(e);
    });
  }

  /**
   * 添加一张表
   * @param tableOption<Object>
   * @tableName 表名
   * @option 表配置
   * @index 索引配置
   * */
  add_table(tableOption = {}) {
    this._status = false;
    this.table.push(tableOption);
  }

  /**
   * @method 查询某张表的所有数据
   * @param {Object}
   *   @property {String} tableName 表名
   *   @property {Function} [success] @return {Array} 查询成功的回调，返回查到的结果
   * */
  queryAll({tableName, success = () => {}}) {
    if (typeof success !== "function") {
      log("queryAll方法中success必须是一个Function类型");
      return;
    }

    const handler = () => {
      const res = [];

      this.__create_transaction(
        tableName,
        "readonly"
      ).openCursor().onsuccess = e =>
        this.__cursor_success(e, {
          condition: () => true,
          handler: ({currentValue}) => res.push(currentValue),
          over: () => success(res)
        });
    };

    this.__action(handler);
  }

  /**
   * @method 查询
   * @param {Object}
   *   @property {String} tableName 表名
   *   @property {Function} condition 查询的条件
   *      @arg {Object} 遍历每条数据，和filter类似
   *      @return 条件
   *   @property {Function} [success] @return {Array} 查询成功的回调，返回查到的结果
   * */
  query({tableName, deviceId, condition, success = () => {}}) {
    if (typeof success !== "function") {
      log("query方法中success必须是一个Function类型");
      return;
    }

    if (typeof condition !== "function") {
      log("in query,condition is required,and type is function");
      return;
    }
    const handler = () => {
      let res = [];
      res = this.cacheData[tableName][deviceId]?.filter(condition);

      success(res);
      // this.__create_transaction(
      //   tableName,
      //   "readonly"
      // ).openCursor().onsuccess = e =>
      //   this.__cursor_success(e, {
      //     condition,
      //     handler: ({currentValue}) => res.push(currentValue),
      //     over: () => success(res)
      //   });
    };

    this.__action(handler);
  }

  /**
   * @method 增加数据
   * @param {Object}
   *   @property {String} tableName 表名
   *   @property {Object} data 插入的数据
   *   @property {Function} [success] 插入成功的回调
   * */
  insert({tableName, deviceId, data, success = () => {}, error = () => {}}) {
    if (!(isArray(data) || isObject(data))) {
      log("in insert，data type is Object or Array");
      return;
    }

    if (typeof success !== "function") {
      log("insert方法中success必须是一个Function类型");
      return;
    }
    let arr = isArray(data) ? data : [data];
    if (this.cacheData[tableName]){
      if (!this.cacheData[tableName][deviceId]){
        this.cacheData[tableName][deviceId] = [];
      }
      arr.forEach((item) => {
        if (this.cacheData[tableName][deviceId].length < this.cacheDataLength){
          this.cacheData[tableName][deviceId].push(item);
        }
      });
    }
    success();
    // this.__action(() => {
    //   const store = this.__create_transaction(tableName, "readwrite");
    //   let promissArr = []; 
    //   arr.forEach(v => promissArr.push(this.promissFactory(store, v))); 
    //   // this.__create_transaction(tableName, "readwrite").add(data);
    //   if (promissArr.length > 0){
    //     Promise.all(promissArr).then(responseData => {
    //       success();
    //     }).catch(err => {
    //       error(err);
    //     });
    //   } else {
    //     success();
    //   }
    // });
  }

  promissFactory(store, data){
    return new Promise ((res, rej) => {
      let request = store.add(data);
      request.onsuccess = function(){
        res();
      };
      request.onerror = function(){
        rej();
      };
    });
  }

  /**
   * @method 删除数据
   * @param {Object}
   *   @property {String} tableName 表名
   *   @property {Function} condition 查询的条件，遍历，与filter类似
   *      @arg {Object} 每个元素
   *      @return 条件
   *   @property {Function} [success] 删除成功的回调  @return {Array} 返回被删除的值
   *   @property {Function} [error] 错误函数 @return {String}
   * */
  delete({tableName, deviceId, condition, success = () => {}}) {
    if (typeof success !== "function") {
      log("delete方法中success必须是一个Function类型");
      return;
    }

    if (typeof condition !== "function") {
      log("in delete,condition is required,and type is function");
      return;
    }

    const handler = () => {
      let res = [];

      this.__create_transaction(
        tableName,
        "readwrite"
      ).openCursor().onsuccess = e =>
        this.__cursor_success(e, {
          condition,
          handler: ({currentValue, cursor}) => {
            res.push(currentValue);
            cursor.delete();
          },
          over: () => {
            if (this.cacheData[tableName] && this.cacheData[tableName][deviceId]){
              let index = this.cacheData[tableName][deviceId].findIndex(condition);
              if (index > -1) {
                this.cacheData[tableName].splice(index, 1);
              }
            }
            if (res.length == 0) {
              log(`in delete ,数据库中没有任何符合condition的元素`);
              return;
            }
            success(res);
          }
        });
    };

    this.__action(handler);
  }

  /**
   * @method 删除数据(主键)
   * @param {Object}
   *   @property {String} tableName 表名
   *   @property {String\|Number} target 目标主键值
   *   @property {Function} [success] 删除成功的回调  @return {Null}
   * */
  delete_by_primaryKey({
    tableName,
    target,
    success = () => {},
    error = () => {}
  }) {
    if (typeof success !== "function") {
      log("in delete_by_primaryKey，success必须是一个Function类型");
      return;
    }

    this.__action(() => {
      const request = this.__create_transaction(tableName, "readwrite").delete(
        target
      );
      request.onsuccess = () => success();
      request.onerror = () => error();
    });
  }

  /**
   * @method 修改某条数据(主键)
   * @param {Object}
   *   @property {String} tableName 表名
   *   @property {String\|Number} target 目标主键值
   *   @property {Function} handle 处理函数，接收本条数据的引用，对其修改
   *   @property {Function} [success] 修改成功的回调   @return {Object} 返回被修改后的值
   * */
  update_by_primaryKey({tableName, target, success = () => {}, handle}) {
    if (typeof success !== "function") {
      log("in update_by_primaryKey，success必须是一个Function类型");
      return;
    }
    if (typeof handle !== "function") {
      log("in update_by_primaryKey，handle必须是一个Function类型");
      return;
    }

    this.__action(() => {
      const store = this.__create_transaction(tableName, "readwrite");
      store.get(target).onsuccess = e => {
        const currentValue = e.target.result;
        handle(currentValue);
        store.put(currentValue);
        success(currentValue);
      };
    });
  }

  /**
   * @method 修改数据
   * @param {Object}
   *   @property {String} tableName 表名
   *   @property {Function} condition 查询的条件，遍历，与filter类似
   *      @arg {Object} 每个元素
   *      @return 条件
   *   @property {Function} handle 处理函数，接收本条数据的引用，对其修改
   *   @property {Function} [success] 修改成功的回调，返回修改成功的数据   @return {Array} 返回被修改后的值
   * */
  update({tableName, condition, handle, success = () => {}}) {
    if (typeof handle !== "function") {
      log("in update,handle必须是一个function类型");
      return;
    }

    if (typeof success !== "function") {
      log("in update,success必须是一个function类型");
      return;
    }

    if (typeof condition !== "function") {
      log("in update,condition is required,and type is function");
      return;
    }

    const handler = () => {
      let res = [];

      this.__create_transaction(
        tableName,
        "readwrite"
      ).openCursor().onsuccess = e =>
        this.__cursor_success(e, {
          condition,
          handler: ({currentValue, cursor}) => {
            handle(currentValue);
            res.push(currentValue);
            cursor.update(currentValue);
          },
          over: () => {
            if (res.length == 0) {
              log(`in update ,数据库中没有任何符合condition的元素`);
              return;
            }
            success(res);
          }
        });
    };
    this.__action(handler);
  }

  /**
   * @method 查询数据（主键值）
   * @param {Object}
   *   @property {String} tableName 表名
   *   @property {Number|String} target 主键值
   *   @property {Function} [success] 查询成功的回调，返回查询成功的数据   @return {Object} 返回查到的结果
   *
   * */
  query_by_primaryKey({tableName, target, success = () => {}}) {
    if (typeof success !== "function") {
      log("in query_by_primaryKey,success必须是一个Function类型");
      return;
    }
    const handleFn = () => {
      this.__create_transaction(tableName, "readonly").get(
        target
      ).onsuccess = e => {
        const result = e.target.result;
        success(result || null);
      };
    };
    this.__action(handleFn);
  }

  /**
   * @function query_by_index 查询数据（索引）
   * @typedef {Object} Obj
   * @property {String} tableName 表名
   * @property {Number|String} indexName 索引名
   * @property {Number|String} deviceId 设备id
   * @property {Number|String} target 索引值
   * @property {() => void} success 查询成功的回调，返回查询成功的数据  
   * @param {Obj} obj 
   * @return {Obj} 返回查到的结果
   * */
  query_by_index({tableName, deviceId, indexName, target, success = () => {}}) {
    if (typeof success !== "function") {
      log("in query_by_index,success必须是一个Function类型");
      return;
    }
    const handleFn = () => {
      let cacheData = this.cacheData[tableName] ? this.cacheData[tableName][deviceId] || [] : this.cacheData[tableName][deviceId];
      let data = cacheData.find(ele => ele[indexName] === target);
      if (data) {
        success(data);
      } else {
        this.__create_transaction(tableName, "readonly")
          .index(indexName)
          .get(target).onsuccess = e => {
            const result = e.target.result;
            success(result || null);
          };
      }
    };
    this.__action(handleFn);
  }

  /**
   * @method 游标开启成功,遍历游标
   * @param {Function} 条件
   * @param {Function} 满足条件的处理方式 @arg {Object} @property cursor游标 @property currentValue当前值
   * @param {Function} 游标遍历完执行的方法
   * @return {Null}
   * */
  __cursor_success(e, {condition, handler, over}) {
    const cursor = e.target.result;
    if (cursor) {
      const currentValue = cursor.value;
      if (condition(currentValue)) handler({cursor, currentValue});
      cursor.continue();
    } else {
      over();
    }
  }

  /**
   * @method 开启事务
   * @param {String} 表名
   * @param {String} 事务权限
   * @return store
   * */
  __create_transaction(tableName, mode = "readwrite") {
    if (!tableName || !mode) {
      throw new Error("in __create_transaction,tableName and mode is required");
    }
    const transaction = this.db.transaction(tableName, mode);
    return transaction.objectStore(tableName);
  }

  // db是异步的,保证fn执行的时候db存在
  __action(handler) {
    const action = () => {
      handler();
    };
    // 如果db不存在，加入依赖
    if (!this.db) {
      this._dep_.add(action);
    } else {
      action();
    }
  }

  /**
   * 创建table
   * @option<Object>  keyPath指定主键 autoIncrement是否自增
   * @index 索引配置
   * */
  __create_table(idb, {tableName, option, indexs = []}) {
    this.cacheData[tableName] = {};
    if (!idb.objectStoreNames.contains(tableName)) {
      let store = idb.createObjectStore(tableName, option);
      for (let indexItem of indexs) {
        this.__create_index(store, indexItem);
      }
    }
  }

  /**
   * 创建索引
   * @option<Object> unique是否是唯一值
   * */
  __create_index(store, {key, option}) {
    store.createIndex(key, key, option);
  }
}

function Idb({dbName, version = new Date().getTime(), tables = []}) {
  const db = new DB({
    dbName,
    version
  });

  for (let tableItem of tables) {
    db.add_table(tableItem);
  }

  return new Promise((resolve, reject) => {
    db.open({
      success: () => {
        log(`数据库 ${dbName} 已经打开`);
        resolve(db);
      },
      error: err => {
        reject(err);
      }
    });
  });
}

export default Idb;
```

