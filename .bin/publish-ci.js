const {exec} = require('child_process');

const execPromise = (command)=>{
    return new Promise(function(resolve, reject) {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(stdout.trim());
        }).stdout.pipe(process.stdout);
    });
}

async function publish(){
    try{
        await execPromise(`npm config set //registry.npmjs.org/:_authToken ${process.env.NPM_TOKEN}`);
        await execPromise(`npm publish --access=public`);
    }
    catch(err){
        throw err;
    }
}

publish().then(()=>{
    console.log("Finished publishing!");
})
.catch((err)=>{
    console.error("Failed to publish: ", err);
})