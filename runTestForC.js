var fs = require('fs');
var argv = process.argv.slice(2);
var child_process = require('child_process');
var testfile;

function printUsage() {
    var usage = [
        'Usage :',
        'node runTestForC.js exampleTest.c ==> runs all tests',
        'node runTestForC.js exampleTest.c -list ==> lists all tests',
        'node runTestForC.js exampleTest.c -stop ==> stops on first failure',
        'node runTestForC.js exampleTest.c -only namePart ==> runs all tests that match the namePart'
    ];
    console.log(usage.join('\t\n'));
}


var isOption = function(arg){return (arg[0] =='-');};

var isFile = function(arg){return !isOption(arg);};

function readFile(fileName) {
    try {
        return fs.readFileSync('./' + fileName, 'utf-8');
    } catch (e) {
        console.log(e.message);
    }
};

function extractTests(fileContent) {
    var tests = fileContent.match(/(\btest_\w+)/g);
    return tests.map(function(test) {
        return test + "\(\);";
    });
};

function printFormattedErr(err) {
   process.stdout.write(err);
}

function printResult(test, allTests, summary,dependency) {
    return function(err, stdout, stderr) {
        printTestName(test);
        if (stdout) console.log(stdout);
        if (err || stderr) summary.failed++, printFormattedErr(stderr);
        console.log('--------------');
        runAllTests(allTests, summary,dependency);
    }
}

function createFile(test) {
    var sample = ["#include <stdio.h>",
        "#include \"" + testfile + "\"",
        "int main(void) {"
    ];
    return sample.join('\n') + test + 'return 0;}';
}

function printTestName(test) {
    console.log('===>', test.substr(0, test.length - 3));
}

function listTestNames(tests) {
    tests.forEach(printTestName);
}

function printTestCounts(summary) {
    console.log('failed/total :\t', summary.failed + '/' + summary.totalTest);
};

function runAllTests(tests, summary,dependency) {
    if (tests.length == 0) {
        printTestCounts(summary);
        return;
    }
    var test = tests.shift();
    var mainFile = createFile(test,testfile);
    fs.writeFileSync('test_main.c', mainFile);
    var command = 'gcc -o arrayUtilTest test_main.c ';
    if(dependency) command += dependency;
    try{
        child_process.execSync(command);
        child_process.exec('./arrayUtilTest', printResult(test, tests, summary,dependency));
    }catch(e){ console.log(e.message)};
    
};

function main() {
    var option = argv.filter(isOption).join(' ');
    var files = argv.filter(isFile);
    testfile = files[0];
    var dependency = files.slice(1).join(' ');
    if (testfile) {
        var fileContent = readFile(testfile);
        var tests = extractTests(fileContent);
        var summary = {
            failed: 0,
            totalTest: tests.length
        }
        console.log("loading tests from " + testfile + "\n--------------");
        if (option)
            listTestNames(tests);
        else
        runAllTests(tests, summary,dependency);
    } else
        printUsage();
};
main();
