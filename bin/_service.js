/*    SERVICE - AUTOMATIZAR GERAÇÃO DE VERSOES E PUBLICAÇÃO DO PACKAGE    */

const fs = require('fs'),
    path = require('path'),
    Promise = require('promise'),
    { exec } = require('child_process');

let versionValue, versionUpdate, commitMessage;

(async () => {
    versionUpdate = process.argv[2];
    commitMessage = process.argv[3];

    if (!versionUpdate) return console.log('Versão não informada.');
    if (!['patch', 'minor', 'major'].includes(versionUpdate)) return console.log("Versão informada não existe, tipos:['patch', 'minor', 'major']");
    versionValue = versionUpdate == 'patch' ? 2 : versionUpdate == 'minor' ? 1 : 0;

    await update();
})();

async function update() {
    try {
        console.log('START SERVICE...');

        console.log('BUILD FILES  ...');
        await prom('gulp build');

        const jsons = prepareJSON();
        console.log('GIT PROCESS  ...');

        await prom('git add .');
        await prom(`git commit -m "${commitMessage || (`Update -${versionUpdate}- para versão v${jsons.objPackage.version}`)}"`);
        await prom('git push');
        await prom(`git tag v${jsons.objPackage.version}`);
        await prom(`git push origin v${jsons.objPackage.version}`);

        console.log('NPM PUBLISH  ...');

        if (await verificarUserNpm())
            await prom(`npm publish`);
        else if (await confirmLogNpm()) {
            await prom('start cmd.exe /K npm adduser')

            if (await verificarUserNpm())
                await prom(`npm publish`);
            else
                console.error('Conta npm não autenticada, verifique para publicar.')
        }
        process.exit(-1);

        end();
    } catch (ex) {
        end(ex);
    }
}

async function prom(command) {
    return new Promise((resolve, reject) => {
        exec(command, (err, out) => {
            if (err) return reject(err);
            if (out && out.trim()) console.log(out);
            resolve(out);
        })
    });
}

function end(ex) {
    console.log('______________________________________________________________________');
    if (ex) {
        console.log('### ERROUU ###');
        console.log(ex);
    } else
        console.log(':: EXIT....');
    console.log('______________________________________________________________________');
}

async function verificarUserNpm() {
    let user;
    try {
        user = new Buffer(await prom('npm whoami')).toString().trim();
    } catch (error) { }
    return user == 'gustavomaritan';
}

async function confirmLogNpm() {
    try {
        let retorno = await confirm();
        return retorno.toLowerCase() == 'y'
    } catch (error) {
        return false;
    }

    async function confirm() {
        const prompt = require('prompt');
        prompt.message = '';
        prompt.delimiter = '';
        return new Promise((resolve, reject) => {
            prompt.start();
            prompt.get({
                properties: {
                    confirm: {
                        pattern: /^(?:[yY]|[nN])$/,
                        description: 'Deseja conectar ao npm para publicar (y|n)?',
                        message: 'Informe (y ou n) para continuar.',
                        required: true
                    }
                }
            }, (err, result) => {
                if (err) return reject(err);
                resolve(result.confirm);
            });
        });
    }
}

function prepareJSON() {
    const pack = fs.readFileSync(path.join(process.cwd(), 'package.json')),
        packDist = fs.readFileSync(path.join(process.cwd(), 'dist/package.json')),
        bower = fs.readFileSync(path.join(process.cwd(), 'bower.json')),
        objPackage = JSON.parse(pack),
        objBower = JSON.parse(bower),
        objPackDist = JSON.parse(packDist);

    let a = objPackage.version.split('.'),
        oldVersion = objPackage.version;

    a[versionValue] = +a[versionValue] + 1;

    if (versionUpdate == 'major') { a[1] = 0; a[2] = 0; }

    objPackDist.version = objBower.version = objPackage.version = a.join('.');

    fs.writeFileSync(path.join(process.cwd(), 'package.json'), JSON.stringify(objPackage, null, 4));
    fs.writeFileSync(path.join(process.cwd(), 'bower.json'), JSON.stringify(objBower, null, 4));
    fs.writeFileSync(path.join(process.cwd(), 'dist/package.json'), JSON.stringify(objPackDist, null, 4));

    return {
        objPackage,
        objBower,
        objPackDist
    }
}

/*
    await prom('gulp build');
    await prom('git add .');
    await prom(`git commit -m "${commitMessage || (`Update -${versionUpdate}- para versão v${objPackage.version}`)}"`);
    await prom('git push');
    await prom(`git tag v${objPackage.version}`);
    await prom(`git push origin v${objPackage.version}`);
    await prom(`npm publish`);
*/