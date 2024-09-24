# Tag 标记版本号

主要用于修改根目录下的package.json 中的version 变量的值为当前设置的tag 版本号

# 参数

- version 版本号: 使用 ${{ github.ref_name }} 来设置
- commit 提交日志. 默认为 : `[修改] 修改版本号为` , 后面将会追加上面的版本号参数

# 使用示例

```yaml
name: Publish Release

on:
  push:
    tags:
      - '*'
    #    branches: [main]
    #schedule:
    # 定时任务，每天 UTC 时间 0 点运行
    #- cron: "0 0 * * *"
  #workflow_dispatch:
permissions: # Global permissions configuration starts here
  contents: read                # 'read' access to repository contents
  pull-requests: write          # 'write' access to pull requests

jobs:
  tags:
    runs-on: ubuntu-latest

    permissions:
      contents: write
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0 # 为了 git pull --unshallow，我们需要获取所有的提交历史

      - name: Set up Git user
        run: |
          git config --global user.email "wangfj11@foxmail.com"
          git config --global user.name "AlianBlank"

      - name: change-version-by-tag
        uses: AlianBlank/github-action-tag-version@0.0.6
        with:
          version: ${{ github.ref_name }}
          
      - name: Push changes
        uses: ad-m/github-push-action@master
        with:
            branch: ${{ github.head_ref }}
```
