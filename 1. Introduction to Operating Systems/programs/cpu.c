#include <stdio.h>      // for input/output functions
#include <stdlib.h>     // for exit function
#include <unistd.h>     // for usleep function (used to create a delay)

int main(int argc, char *argv[]) {  // main function, starts the program
    if (argc != 2) {  // checks if exactly one argument is passed
        fprintf(stderr, "usage: cpu <string>\n");  // print usage info if not
        exit(1);  // exit with an error code (1) if no argument is passed
    }

    char *str = argv[1];  // assign the passed argument to a variable `str`
    while (1) {  // infinite loop, keeps running until you stop it manually
        usleep(1000000);  // delay of 1 second (1,000,000 microseconds)
        printf("%s\n", str);  // print the string stored in `str`
    }

    return 0;
}
