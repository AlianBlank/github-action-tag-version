const util = require("util");
const exec = util.promisify(require("child_process").exec);
const core = require("@actions/core");
const fs = require('fs')


async function main() {
    const Version = core.getInput("version") || '1.0.0';
    const CommitMessage = core.getInput("commit") || ('[修改] 修改版本号为' + Version);

    await exec("git fetch --all --tags");

    const { stdout } = await exec("git tag");

    const packageJsonPath = './package.json'

    // 读取package.json文件
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath))

    // 获取当前版本号
    const currentVersion = packageJson.version
    core.setOutput("currentVersion", currentVersion);
    // 自增修订版本号
    const versionParts = Version.split('.')
    versionParts[2] = parseInt(versionParts[2], 10) + 1

    // 更新package.json文件中的版本号
    packageJson.version = versionParts.join('.')

    // 将更新后的package.json文件写入磁盘
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))

    // 将package.json文件添加到暂存区
    await exec(`git add package.json`);
    // 提交修改
    await exec(`git commit -m ${CommitMessage}`);

    core.setOutput("newTag", Version);
}

main().catch(error => core.setFailed(error.message));
