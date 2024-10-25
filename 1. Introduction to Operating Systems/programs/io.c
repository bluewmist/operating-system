#include <stdio.h>       // Standard I/O library
#include <unistd.h>      // For file operations like write and close
#include <assert.h>      // For assertions to validate success of operations
#include <fcntl.h>       // For file control options (open flags)
#include <sys/types.h>   // For system-defined types
#include <sys/stat.h>    // For file permission constants like S_IRWXU

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

    return 0;  // Return 0 to indicate successful execution
}
