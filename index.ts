import inquirer from "inquirer";
import chalk from "chalk";
import { createSpinner } from "nanospinner";
import { brotliDecompress } from "zlib";


const sleep=()=>{
    return new Promise((res)=>{
        setTimeout(res,1000)
    })
}

interface Todos{
    text:string,
    id:number,
    completed:boolean
}

let todos:Todos[]=[{text:"Dummy",id:Math.floor(Math.random()*9999999999),completed:false}]

const Options= async ()=>{
    const input=await inquirer.prompt([
        {
            name:'What you want to do?',
            type:'list',
            choices:[
                {name:"Add Todo",value:'A'},
                {name:"Remove Todo",value:'R'},
                {name:"Display Todo", value:'D'}
            ]
        }
    ])
    let value= await input['What you want to do?']
    return value
}

const addTodo=async()=>{
    let value:string
    while(true){
        const input=await inquirer.prompt({
            name:"Enter Todo",
            type:'input',
        })
        value=await input['Enter Todo']
        if(value.trim()){
            break
        }
    }
    const spinner = createSpinner("Adding Todo").start()
    todos.push({text:value.trim(),id:Math.floor(Math.random()*9999999999),completed:false})
    await sleep()
    spinner.success({text:"Todo Added Successfully!!"})
}

const RemoveTodo=async()=>{
    if(!todos.length){
        console.log(chalk.redBright.bold("NO TODO AVAILABLE!!"));
        return
    }
    let todo=todos.map((val)=>{return {name:val.text,value:val.id}})
    const input = await inquirer.prompt({
        name:'Remove Todo',
        type:'list',
        choices:todo
    })
    let value=await input['Remove Todo']
    const spinner = createSpinner("Removing Todo").start()
    todos=todos.filter((val)=>val.id!==value)
    await sleep()
    spinner.success({text:"Todo Remove Successfully!!"})

}

const DisplaySingle=async(todo:Todos)=>{
    console.log(`Todo: ${todo.text}`)
    console.log(`Status: ${todo.completed?'Completed':'Not Completed'}`)
    if(!todo.completed){
        const input= await inquirer.prompt({
            name:'Do you want to completed?',
            type:'confirm',
        })
        let value=await input['Do you want to completed?']
        if(value){
            todos=todos.filter((val)=>{
                if(val.id===todo.id){
                    val.completed=true
                    return val
                }
                return val
            })
            const spinner = createSpinner("Update Todo").start()
            await sleep()
            spinner.success({text:"Todo Update Successfully!!"})
        }
    }
}

const DisplayTodo=async()=>{
    if(!todos.length){
        console.log(chalk.redBright.bold("NO TODO AVAILABLE!!"));
        return
    }
    let todo=todos.map((val)=>{return {name:val.text,value:val}})
    const input = await inquirer.prompt({
        name:'Display Todo',
        type:'list',
        choices:todo
    })
    let value=await input['Display Todo']
    await DisplaySingle(value)
}

while(true){
    let option= await Options()
    if(option==='A'){
        await addTodo()
    }
    if(option==='D'){
        await DisplayTodo()
    }
    if(option==='R'){
        await RemoveTodo()
    }
    const input=await inquirer.prompt({
        name:'Do you want to continue?',
        type:'confirm'
    })
    let value:boolean=await input['Do you want to continue?']
    if(value){
        break
    }
    console.log(chalk.whiteBright("==================================================================================Hy"))
}