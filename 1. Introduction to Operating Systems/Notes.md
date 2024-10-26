#### Introduction to Operating System

If you are not familiar with computer program you can read [Introduction to Computing Systems](https://icourse.club/uploads/files/96a2b94d4be48285f2605d843a1e6db37da9a944.pdf). It is a really comprehensive book to start your computer science journey if you have no idea about programming in general.

Concepts learnt in the chapter:

- Running program -> Executes several instructions per second.
- Processor's job -> fetch from memory, decode, execute.
- Von Neumann model of computing.
- Virtualization of resources

Crux of the problem.

- How to virtualize processes?

- Benefit of virtualization.
- System calls for user interaction.
- OS as a resource manager.

##### 2.1 Virtualizing the CPU

```c
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
```

The above program prints something which is entered by the user as a command line argument. If we run multiple instances of this program on a single CPU, both start executing properly even with a single CPU. That is because OS along with the hardware creates this illusion of multiple CPUs and this is what we call virtualization of CPU.

There are certain policies followed by the OS to avoid some conflicts which will be discussed in further chapters.

##### 2.2 Virtualizing the memory

```c
#include <stdio.h>      // for printf function
#include <stdlib.h>     // for malloc and assert functions
#include <unistd.h>     // for usleep function
#include <assert.h>     // for assert function

int main(int argc, char *argv[]) {
    // Allocate memory dynamically for one integer
    int *p = malloc(sizeof(int));

    // Check if memory allocation was successful
    assert(p != NULL);  // if p is NULL, the program will terminate

    // Print the process ID and the address of the allocated memory
    printf("(%d) address pointed to by p: %p\n", getpid(), p);

    // Initialize the integer at the allocated memory to 0
    *p = 0;

    // Start an infinite loop to increment and print the integer value
    while (1) {
        usleep(1000000);  // pause for 1 second (1,000,000 microseconds)

        *p = *p + 1;      // increment the integer at the memory pointed to by p
        printf("(%d) p: %d\n", getpid(), *p);  // print process ID and new value of *p
    }

    // Free the allocated memory (although this line is never reached due to infinite loop)
    free(p);

    return 0;  // return 0 to indicate successful completion (never reached)
}
```

The above program creates a slot in the main memory to store an integer type, then it prints the process id and address of the variable. It initially stores 0 in the variable. Finally the loop increments the value stored at the address held in p.

If you run multiple instances of the program we observe same memory address being allocated to the programs. This is because of the virtual address space allocated to each process and the OS maps it to the physical memory of the machine. This is virtualization of memory.

##### 2.3 Concurrency

```c
#include <stdio.h>      // for printf function
#include <stdlib.h>     // for atoi and exit functions
#include <pthread.h>    // for pthread functions

// Define a shared counter variable with `volatile` to indicate it may be modified concurrently
volatile int counter = 0;
int loops;  // variable to store the number of loops each thread will execute

// Worker function that each thread will execute
void *worker(void *arg) {
    int i;
    // Loop `loops` times, incrementing the shared counter each time
    for (i = 0; i < loops; i++) {
        counter++;  // increment the shared counter
    }
    return NULL;  // thread function must return NULL since it’s of type `void *`
}

int main(int argc, char *argv[]) {
    // Check if the program received exactly one command-line argument
    if (argc != 2) {
        fprintf(stderr, "usage: threads <value>\n");  // print usage message if not
        exit(1);  // exit with error status if argument count is incorrect
    }

    // Convert the argument (string) to an integer and assign it to `loops`
    loops = atoi(argv[1]);

    // Declare two pthread_t variables to hold thread identifiers
    pthread_t p1, p2;

    // Print the initial value of `counter` (expected to be 0)
    printf("Initial value : %d\n", counter);

    // Create the first thread, passing `worker` as the function to execute
    pthread_create(&p1, NULL, worker, NULL);

    // Create the second thread, also running `worker`
    pthread_create(&p2, NULL, worker, NULL);

    // Wait for the first thread to finish execution
    pthread_join(p1, NULL);

    // Wait for the second thread to finish execution
    pthread_join(p2, NULL);

    // Print the final value of `counter`
    printf("Final value : %d\n", counter);

    return 0;  // return 0 to indicate successful execution
}
```

To understand the above program you will need to know about threads in C and concurrency as well. Note that concurrency and parallelism are both different.
You can learn the difference [here](https://www.youtube.com/watch?v=oV9rvDllKEg&t=645s)

In the program we create two threads p1 and p2. We wait for it finish execution. It loops over for the number of times we mention in the command line argument, so each thread executes the worker function once. The counter variable is shared among both the threads, which means each thread increases the value of count n number of times so if we provide 1000 we get a final value of 2000 as result. But if we give a large number we start getting different output and not 2n. This is because of how instructions get executed in OS discussed in upcoming topics.
This crux of the problem here is how do we build a correctly working program when there are concurrently executing threads.

##### 2.4 Persistence

Volatile memory like DRAM(Main memory) loses all information when the power goes off or if the system crashes and hence we required I/O device like hard-drive (HDD, SSD) to persist data.
The software which manages files is called the `file system`.
Disk is not virtualized as the user might want to share them among different applications.

```c
#include <stdio.h> // Standard I/O library
#include <unistd.h> // For file operations like write and close
#include <assert.h> // For assertions to validate success of operations
#include <fcntl.h> // For file control options (open flags)
#include <sys/types.h> // For system-defined types
#include <sys/stat.h> // For file permission constants like S_IRWXU

int main(int argc, char *argv[]) {
// Open/create the file "/tmp/file" with write-only permissions
// O_WRONLY: Open file for write-only access
// O_CREAT: Create the file if it doesn't exist
// O_TRUNC: Truncate the file to zero length if it already exists
// S_IRWXU: Sets permissions so that the file's owner can read, write, and execute
int fd = open("/tmp/file", O_WRONLY | O_CREAT | O_TRUNC, S_IRWXU);

// Assert that the file descriptor is valid (greater than -1)
assert(fd > -1);

// Write "hello world\n" (13 bytes) to the file
int rc = write(fd, "hello world\n", 13);

// Assert that 13 bytes were written successfully
assert(rc == 13);

// Close the file descriptor
close(fd);
return 0; // Return 0 to indicate successful execution
}
```

The open, write and close operations are system calls routed to the file system.
OS is sometimes seen as a standard library as it provides the higher level access to the devices using system calls.
