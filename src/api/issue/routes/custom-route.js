module.exports = {
  routes: [
    {
      method: "PUT",
      path: "/issues/completed/:id",
      handler: "issue.completedIssue",
    },
    {
      method: "GET",
      path: "/issues/count",
      handler: "issue.countStatus",
    },
  ],
};
