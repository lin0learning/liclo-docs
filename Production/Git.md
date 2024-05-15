# Git Operation

## Git 基本操作

查看当前分支

```bash
git branch
```

查看所有分支

```bash
git branch -a
```

查看远程分支

```bash
git branch -r
```

查看本地分支

```bash
git branch -v
```

关联远程分支

```bash
git remote add origin git@gitlab-example.com:xxx/xxxx.git
```



切换分支

```bash
git checkout 分支名
```

当前分支下新建分支

```bash
git checkout -b 新分支名
```

推送新分支到远端

```bash
git push origin 新分支名
```

建立本地到上游（远端）仓的链接 – （这样代码才能提交上去）

```bash
git branch --set-upstream-to=origin/新分支名 本地分支名字(未输入则默认当前分支)
```

再次拉取验证

```bash
git pull
```



## Repository not found

在使用 git 拉取 gitlab 项目时出现以下错误信息：Repository not found。

出现此错误是因为本地已经保存过之前项目的权限信息--账号/密码，但是该账号密码对于想要拉取代码的项目权限不匹配，因此需要在拉取代码时添加具有权限的账号密码：

假设项目地址为：`192.168.x.x/xx/xx.git`

方式一：项目路径上加上用户名 `git clone http://username@192.168.x.x/xx/xx.git`，并在后续 git 弹窗中输入帐号密码

方式二：远程地址的时候带上用户名及密码 `git clone http://yourname:password@192.168.x.x/xx/xx.git`



## Git 删除文件 - rm

- 工作区（Working Directory）：是可以直接编辑的地方。
- 暂存区（Stage/Index）：数据暂时存放的区域。
- 版本库（commit History）：存放已经提交的数据。



`rm`删除工作区文件

```bash
rm ./test.txt
```

`git rm`删除工作区文件， 并且将这次删除放入暂存区

```bash
git rm test.txt
```

`git rm -f`，删除修改的文件

```bash
git rm -f test.txt
```

`git rm --cached`，从git的索引中移除该文件，但保留工作区文件，并且将这次删除放入暂存区。

```bash
git rm --cached test.txt
```

`git rm -r`，删除文件夹/文件

```bash
git rm 文件
git rm -r 文件夹
git rm -r --cached 文件夹 // 保留工作区文件
```



## Git 分支操作

创建分支

```bash
git branch 新分支名称
```

查看所有分支

```bash
git branch -a
```

切换到指定分支(dev)

```bash
git checkout dev
```

创建并切换到新的分支(xxx)

```bash
git checkout -b xxx
```

本地分支关联远程分支

```bash
git branch --set-upstream-to=origin/branch branch  (origin/branch 为远程分支名 branch为本地分支名)
```

删除本地的bug_xxx分支

```bash
git branch -d bug_xxx
```

删除远程的bugx_xxx分支

```bash
git push origin --delete bug_xxx
```

查看当前分支基点（从哪个分支pull下来）

```bash
git reflog show dev-trunk-gjl
```

![image-20240426144833930](https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202404261448170.png)



## Git Tag

查看当前分支下所有 tag

```bash
git tag
git tag -l "xx"  // 使用 -l 参数过滤
```

<img src="https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202404191722204.png" alt="image-20240419172148794"  />

新建 tag 标签

- 轻量标签
  ```bash
  git tag v2.0
  ```

- 附注标签（完整独立对象，包含了打标签者的姓名、邮箱、时间）
  ```bash
  git tag -a v2.1 -m "v2.1版本"
  ```

补打 tag 标签

```bash
git tag -a v3.0 ff28fd51 -m 'tag to previous commit'
```

查看 tag 详细信息

```bash
git show v2.1
```

![image-20240419172241658](https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202404191722735.png)

同步 tag 至远程仓库

```bash
git push origin [tagname]
```

切换 tag

```bash
git checkout v3.0
git checkout -b [newBranchName] [tagname]
```

删除某个 tag

1. 删除某个 tag
   ```bash
   git tag -d v2.0
   ```

2. 删除远程仓库中的 tag
   ```bash
   git push origin :refs/tags/v2.0
   gut push origin --delete tag
   ```

   







## Git 特殊操作

- Revert
- Merge
- Rebase
- CherryPick

### 1. 回滚代码 Revert

```bash
git revert [SHA]
```

当提示冲突时：

**方式一**

可以使用 `git revert --abort`放弃这次回滚

**方式二**

```sql
-- 1、手动解决冲突

-- 2、提交修改
git add .

-- 3、继续revert， 会弹出一个文件，可以修改commit的描述，也可以直接关闭
git revert --continue

-- 4、push代码
git push
```



### 2. 合并代码 Merge/Rebase

merge会把branchA<u>所有的提交打包成一个最终状态</u>，去和branchB的最终状态来一次合并。如果有冲突，我们只需要解决一次冲突就好了。

rebase 会把branchA 上的每一次提交，都**依次合并**到 branchB 上去。 如果在branchA上的三次提交都和branchB有冲突，那你就要解决三次冲突。（因为它是依次提交的，而且会有更多的commit记录）



rebase 除了合并代码，它还有一个很大的用处就是**合并commit**

### 3. 合并commit Rebase

不管有没有 `push`，步骤相同，已经 `push` 的只是多了**最后一步强制提交**：

```bash
git push -f
```

**重写最近一次的commit（未push）**

```bash
git commit -amend
```

**修改旧提交或多个提交的commit**

1. 首先使用`rebase`命令查看最近 `n` 次的 commit

```bash
git rebase -i HEAD~n
```

2. bash栏会有如下内容

```bash
pick 6548427 xxx
pick 0c39034 xxx
pick f7fde4a Change the commit message but push the same commit.

# Rebase 9fdb3bd..f7fde4a onto 9fdb3bd
#
# Commands:
# p, pick = use commit
# r, reword = use commit, but edit the commit message
# e, edit = use commit, but stop for amending
# s, squash = use commit, but meld into previous commit
# f, fixup = like "squash", but discard this commit's log message
# x, exec = run command (the rest of the line) using shell
#
# These lines can be re-ordered; they are executed from top to bottom.
#
# If you remove a line here THAT COMMIT WILL BE LOST.
#
# However, if you remove everything, the rebase will be aborted.
#
# Note that empty commits are commented out
```

此时可以使用 `git rebase --abort` 退出 `rebase`

3. 在需要合并的 `commit message`前，将 `pick` 替换为 `squash`，可使用缩写`s`，`:wq`保存后继续编辑最新的 `commit message`，保存即可
   ```bash
   pick 6548427 xxx
   s 0c39034 xxx
   s f7fde4a Change the commit message but push the same commit.
   ```

   此时会以 `6548427` 节点作为本次合并的`base`记录基点。
4. 强制 `push`

```bash
git push -f
```



### 4. 选择合并 CheryPick

从A分支拣取某几次提交到B分支，可使用命令 `git cherry-pick`

假设在A分支上提交了三次，三次的hash分别是  A1、A2、A3， 现在我们要把 A2、A3 提交合并到B分支上，需要执行的命令如下：

```sql
-- 1、切换到B分支
git checkout B

-- 2、把A2、A3 提交合并过来
git cherry-pick A2 A3

-- 3、提交代码
git push
```

如果有冲突：

**方式一**

取消这次操作：`git chery-pick --abort`

**方式二**

解决冲突

```sql
-- 1、先手动解决冲突

-- 2、添加修改
git add .

-- 3、在解决冲突后继续执行git cherry-pick命令 、 会弹出一个文件，可以修改commit的描述，也可以直接关闭
git cherry-pick --continue

-- 4、push代码
git push
```



### 5. 撤回 commit

```bash
git add file
git commit -m "reason"
```

当还未`git push`时，要撤销这次的`commit`可以使用`git reset`

```bash
git reset --soft HEAD^
```

这个命令将取消最新的提交，但保留更改在你的工作目录和暂存区中。`--hard`将会删除更改及暂存区记录。





## ssh key - gitlab

### 1. 查看/设置 git 用户名与邮箱

```bash
git config user.name
git config user.email
```

![image-20240220093857950](https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202402200939134.png)

```bash
git config --global user.name 用户名
git config --global user.email 邮箱
```



### 2. 查看本地秘钥

![image-20240220094103728](https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202402200941787.png)

### 3. 生成ssh秘钥

```bash
ssh-keygen -t rsa -C 'your_email@youremail.com'
```



### 4. gitlab 添加 ssh key

```bash
sudu gedit id_rsa.pub
cat id_rsa.pub
```



## 多 ssh key 管理

场景：内网gitlab + github个人账户

在`~/.ssh`目录下新建一个 config 文件进行配置：

1. 生成第一个 ssh key 用于 github，并在第一个命令执行时编辑文件名：`id_rsa_github`
   ```bash
   ssh-keygen -t rsa -C 'yourmail@gmail.com'
   ```

2. 生成第二个 ssh key 用于内网 gitlab，并在第一个命令执行时编辑文件名：`id_rsa_gitlab`
   ```bash
   ssh-keygen -t rsa -C 'yourmail@xxx.com'
   ```

3. 添加私钥到 ssh-agent
   ```bash
   ssh-add ~/.ssh/id_rsa_github
   ssh-add ~/.ssh/id_rsa_gitlab
   ```

4. 创建config文件（文件名与后缀修改为config）
   ```
   # gitlab
   Host 192.168.0.26:root
   		HostName 192.168.0.26:root
   		IdentityFile ~/.ssh/id_rsa_gitlab
   		User guojunlin
   		
   # github
   Host github.com
   		HostName github.com
   		IdentityFile ~/.ssh/id_rsa_github
   		User liclo
   ```

   



## github actions

关键文件夹及文件：`.github/workflows/github.yml`

```bash
|-.github
|--workflows
|----github.yml
```

