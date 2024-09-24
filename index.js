const util = require("util");
const exec = util.promisify(require("child_process").exec);
const core = require("@actions/core");
const fs = require('fs')


async function main() {
    const Version = core.getInput("version") || '1.0.0';
    const branch_name = core.getInput("branch_name") || 'main';
    const CommitMessage = (core.getInput("commit") || '[修改] 修改版本号为') + Version;

    const packageJsonPath = './package.json'

    // 读取package.json文件
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath))

    // 获取当前版本号
    const currentVersion = packageJson.version
    // 自增修订版本号
    const versionParts = Version.split('.')
    versionParts[2] = parseInt(versionParts[2], 10) // 这里不要+1. 因为这里是使用tag来做版本号的

    // 更新package.json文件中的版本号
    packageJson.version = versionParts.join('.')

    // 将更新后的package.json文件写入磁盘
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))

    // 将package.json文件添加到暂存区
    await exec(`git add package.json`);
    // 提交修改
    await exec(`git commit -m '${CommitMessage}'`);
}

main().catch(error => core.setFailed(error.message));
