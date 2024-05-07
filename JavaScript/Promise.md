# Promise

## Promise 代码片段

Promise (1) 

```js
function rand(m, n) {
  return Math.ceil(Math.random() * (n - m + 1) + m - 1);
}

btn = document.getElementsByTagName("button")[0];
btn = document.addEventListener("click", () => {
  const p = new Promise((resolve, reject) => {
    setTimeout(() => {
      let n = rand(1, 100);
      if (n <= 30) {
        resolve(n);
      } else {
        reject(n);
      }
    }, 1000);
  })

  p.then((res) => {
    alert("恭喜恭喜！ " + res);
  },(err) => {
    alert("再接再厉！ " + err);
  }
  );
});
```





Promise (2)  

```js
function request(url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.send();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status <= 300) {
          resolve(xhr.response);
        } else {
          reject(xhr.status);
        }
      }
    };
  });
}

btn.addEventListener("click", () => {
  request("https://api.apiopen.top/getJoke").then(
    (res) => {
      console.log(res);
    },
    (err) => {
      console.log(err);
    }
  );
});
```





Promise (3) 

##  Promise 对象属性

### 一、Promise状态

1. Promise的三种状态：
   1. `pending`;
   2. `resolved`、`fulfilled`;
   3. `rejected`
2. Promise的两种状态变化：
   1. `pending`变成`resolved` / `fulfilled`；
   2. `pending`变成`rejected`
3. Promise的一个属性对应其状态：`PromiseState`



## Promise 回调参数及方法

### 二、Promise的resolve与reject回调函数参数

1. 当new一个Promise对象的时候，该Promise对象的PromiseState属性为pending，PromiseResult属性为空：
   ![pending](https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202405071013996.png)
2. 当Promise构造回调函数中调用resolve方法时，Promise对象的PromiseState属性变为fulfilled，PromiseResult属性变为resolve方法的参数：
   ![resolve](https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202405071013130.png)
3. 当Promise构造回调函数中调用reject方法时，Promise对象的PromiseState属性变为rejected，PromiseResult属性变为reject方法的参数。下面报了一个警告，是因为使用reject方法时需要catch：
   ![reject](https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202405071013529.png)



![image-20230519144545873](https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202305191445041.png)

### 三、Promise的then、catch和finally方法（原型链方法）

1. Promise的`then`方法**接收两个回调函数**，第一个回调函数当`PromiseState`为`fulfilled`的时候调用，第二个回调函数当`PromiseState`为`rejected`的时候调用。
2. Promise的`catch`方法**接收一个回调函数**，当Promise的`PromiseState`为`rejected`的时候调用；
3. catch与then方法的区别是：`catch`方法**不能**在`PromiseState`为`fulfilled`的时候调用。上面部分中的警告，在使用了then方法或catch方法后就能解决。



### 四、Promise的resolve和reject方法（实例方法）

1. Promise的`resolve`方法返回一个`PromiseState`为`fulfilled`或者`rejected`的Promise对象；`reject`方法只会返回`PromiseState`为`rejected`的Promise对象；
2. Promise的resolve方法返回一个Promise对象：
   1. 如果参数为Promise对象，则返回的Promise对象的`PromiseState`和`PromiseResult`与参数Promise相同
   2. 如果参数为一个非Promise对象（字符串、数字……），则返回一个`PromiseState`为`fulfilled`，`PromiseResult`为参数的Promise对象
3. Promise的reject方法只会返回一个`PromiseState`为`rejected`，`PromiseResult`为参数的Promise对象。



### 五、Promise的all和race方法

```js
const promise1 = new Promise((resolve, reject) => {
  resolve("111"), reject("error");
});
const promise2 = new Promise((resolve, reject) => {
  resolve("222"), reject("error");
});
const promise3 = new Promise((resolve, reject) => {
  resolve("333"), reject("error");
});
const promise4 = new Promise((resolve, reject) => {
  resolve("444"), reject("error");
});
const promise5 = new Promise((resolve, reject) => {
  resolve("555"), reject("error");
});

const promiseArr = [promise1, promise2, promise3, promise4, promise5]
console.log(Promise.all(promiseArr));
```

1. Promise的all方法参数为Promise数组，返回结果为一个新的Promise。
   1. 如果该Promise数组中，所有的Promise的`PromiseState`属性都是`fulfilled`，那么返回一个`PromiseState`为`fulfilled`，`PromiseResult`为参数Promise数组中每一个Promise的`PromiseResult`组成的集合;
   2. 如果该Promise数组中，有一个Promise的`PromiseState`属性为`rejected`，则返回的Promise的`PromiseState`为`rejected`，`PromiseResult`为数组中第一个`PromiseState`为`rejected`的Promise的`PromiseResult`。
2. Promise的`race`方法参数也是一个Promise数组，返回Promise数组中第一个状态发生改变后的Promise。



### 六、Promise的allSettled和finally方法

1. **`Promise.allSettled()`** 方法以 promise 组成的可迭代对象作为输入，并且返回一个 [`Promise`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise) 实例。当输入的所有 promise 都已敲定时（包括传递空的可迭代类型），返回的 promise 将兑现，并带有描述每个 promsie 结果的对象数组。

   ```js
   const promise1 = Promise.resolve(1);
   const promise2 = new Promise((resolve, reject) => setTimeout(reject, 100, 'foo'));
   const promises = [promise1, promise2];
   
   Promise.allSettled(promises).then((res) => {
     res.forEach(item => {
       console.log(item.status); // fulfilled, rejected
     })
   });
   ```

2. **`Promise.prototype.finally`** 方法返回一个`Promise`。在 promise 结束时，无论结果是 fulfilled 或者是 rejected，都会执行指定的回调函数。这为在 `Promise` 是否成功完成后都需要执行的代码提供了一种方式。这避免了同样的语句需要在 [`then()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/then) 和 [`catch()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch) 中各写一次的情况。

   ```js
   new Promise((resolve, reject) => {
     resolve(123)
   })
   .then()
   .catch()
   .finally()
   ```

   