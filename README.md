# test_runner_for_c
##To use this test runner framework you have to setup your test file accoding the following sample.


#### You have to run a command on your bash terminal ---  npm install

```
      now all error message will be in different color
```

===============================================================
sample_test.c
```
      #include <assert.h>
      #include <stdlib.h>
      #include <stdio.h>
      #include "dependency.h"
```
      void test_generate_fibonacci_of_one(){
      	assert(generate_fibonacci(one)==0);
      }
      
      void test_generate_fibonacci_of_two(){
      	assert(generate_fibonacci(two)==1);
      }
===============================================================
do not create any main function inside your test file
and don not put your test name with in any printf function.



##Usage :
```
       node runTestForC.js test_file.c dependency_file.c -w==> runs all tests
       node runTestForC.js test_file.c dependency_file.c -w -list ==> lists all tests
       node runTestForC.js test_file.c dependency_file.c -w -stop ==> stops on first failure
       node runTestForC.js test_file.c dependency_file.c -w -only namePart ==> runs all tests that match the namePart
       -w is optional to avoid compiler warning
```
