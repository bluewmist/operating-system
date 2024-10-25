#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <assert.h>

int main(int argc, char *argv[]){
  int *p = malloc(sizeof(int));
  assert(p != NULL);
  printf("(%d) address pointed to by p: %p\n", getpid(), p);
  *p = 0;
  while(1){
    usleep(1000000);
    *p = *p + 1;
    printf("(%d) p: %d\n", getpid(), *p);
  }
  return 0;
}