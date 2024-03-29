import * as core from '@actions/core'
import styles from 'ansi-styles';
import fs from 'fs'
import util from 'util'

const plan = process.env.PLAN || ""
const path = process.env.PLAN_PATH || ""
const add = process.env.ADD || "#80FF80"
const remove = process.env.REMOVE || "#FF4040"
const update = process.env.UPDATE || "#FFFF80"

function colourText(text: string): string {
    const regexPlus = /^(\s*\+)/g
    const regexMinus = /^(\s*-)/g
    const regexTilde = /^(\s*~)/g
    if(regexPlus.test(text)) {
        return styles.color.ansi16m(...styles.hexToRgb(add)) + text 
    }
    if(regexMinus.test(text)) {
        return styles.color.ansi16m(...styles.hexToRgb(remove)) + text;
    }
    if(regexTilde.test(text)) {
       return styles.color.ansi16m(...styles.hexToRgb(update)) + text;
    }
    return text;
}

async function run() {
    let out = "";
    try {
        if (!path && !plan) {
            throw Error("No Path or Plan Provided");
        }
        if (path && plan) {
            core.warning("Path and Plan passed only one expected");
        }
        
        const regex = /[^\r\n]+/g;
        let plan_array_filter;
        
        console.log(process.cwd());

        if (path) {
            plan_array_filter = require("fs").readFileSync(path).toString().split("\n");
        } else {
            plan_array_filter = plan.match(regex);
        }

        

        if (plan_array_filter != null) {
            while (plan_array_filter.length != 0) {
                var shift = plan_array_filter.shift();
                if (shift !== undefined) {
                    core.info(colourText(shift));
                }
            }
        }
    } catch (error) {
        if (error instanceof Error) core.setFailed(error.message)
    }
    core.info(out)
}

run()