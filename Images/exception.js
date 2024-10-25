console.log("Start");

// Simulating an API call to fetch a user from the database
function getUser(userId, callback) {
  setTimeout(() => {
    console.log("Fetched user");
    callback({ userId: userId, username: "mounish" });
  }, 1000);
}

function getUser(userId) {
  return new Promise((resolve) => {
    re;
  });
}

// Simulating an API call to fetch posts for a user
function getPosts(userId, callback) {
  setTimeout(() => {
    console.log("Fetched posts");
    callback([
      { postId: 1, content: "Hello World" },
      { postId: 2, content: "Callback Hell!" },
    ]);
  }, 1000);
}

// Simulating an API call to fetch comments for a post
function getComments(postId, callback) {
  setTimeout(() => {
    console.log("Fetched comments");
    callback(["Great post!", "Very informative."]);
  }, 1000);
}

// Chaining the callbacks
getUser(1, (user) => {
  console.log("User:", user.username);

  getPosts(user.userId, (posts) => {
    console.log("Posts:", posts);

    getComments(posts[0].postId, (comments) => {
      console.log("Comments on first post:", comments);

      getComments(posts[1].postId, (comments) => {
        console.log("Comments on second post:", comments);
        console.log("End");
      });
    });
  });
});

// Simulating an API call to fetch a user from the database
function getUser(userId) {
  return new Promise((resolve) => {
    setTimeout(function name() {
      console.log("Fetched user");
      resolve({ userId: userId, username: "mounish" });
    }, 1000);
  });
}

// Simulating an API call to fetch posts for a user
function getPosts(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Fetched posts");
      resolve([
        { postId: 1, content: "Hello World" },
        { postId: 2, content: "Callback Hell!" },
      ]);
    }, 1000);
  });
}

// Simulating an API call to fetch comments for a post
function getComments(postId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Fetched comments");
      resolve(["Great post!", "Very informative."]);
    }, 1000);
  });
}

// Chaining the promises
getUser(1)
  .then((user) => {
    console.log("User:", user.username);
    return getPosts(user.userId);
  })
  .then((posts) => {
    console.log("Posts:", posts);
    return getComments(posts[0].postId).then((comments) => {
      console.log("Comments on first post:", comments);
      return getComments(posts[1].postId);
    });
  })
  .then((comments) => {
    console.log("Comments on second post:", comments);
    console.log("End");
  })
  .catch((error) => {
    console.error("An error occurred:", error);
  });
