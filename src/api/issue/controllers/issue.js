"use strict";

/**
 *  issue controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::issue.issue", ({ strapi }) => ({
  async create(ctx) {
    const author = ctx.state.user.id;
    ctx.request.body.data.author = author;
    const response = await super.create(ctx);
    return response;
  },

  async delete(ctx) {
    const authorId = ctx.state.user.id;
    const { id } = ctx.params;
    //find the issue by id
    const foundIssue = await strapi.entityService.findOne(
      "api::issue.issue",
      +id,
      {
        populate: "author",
      }
    );

    if (!foundIssue) return ctx.notFound("Issue is not found to be deleted");
    if (foundIssue && foundIssue?.author?.id !== authorId) {
      return ctx.unauthorized("You are not the owner of issue");
    }

    // some logic here
    const response = await super.delete(ctx);
    // some more logic

    return response;
  },
  async update(ctx) {
    const loggedInUserID = ctx.state.user.id;
    const { id } = ctx.params;
    console.log(ctx.state.user);

    //find the issue by id
    const foundIssue = await strapi.entityService.findOne(
      "api::issue.issue",
      +id,
      {
        populate: "author",
      }
    );
    if (!foundIssue) return ctx.notFound("Issue is not found to be updated");

    if (foundIssue && foundIssue.author.id !== loggedInUserID) {
      return ctx.unauthorized("You are not authorized to update the issue");
    }
    const response = await super.update(ctx);

    return response;
  },

  async completedIssue(ctx) {
    const loggedInUserID = ctx.state.user.id;
    const { id } = ctx.params;
    //find the issue by id
    const foundIssue = await strapi.entityService.findOne(
      "api::issue.issue",
      +id,
      {
        populate: "assignedTo",
      }
    );

    if (foundIssue.assignedTo.id !== loggedInUserID) {
      return ctx.unauthorized("You are not authorized to completed the issue");
    }
    const response = await super.update(ctx);

    return response;
  },

  async countStatus() {
    //get all issues
    const issues = await strapi.entityService.findMany("api::issue.issue");
    const counter = issues.reduce(
      (acc, curr) => {
        acc.totalCount = acc.totalCount + 1;
        curr.status === "new" ? (acc.newCount += 1) : acc.newCount;
        curr.status === "inProgress"
          ? (acc.progressCount += 1)
          : acc.progressCount;
        curr.status === "completed"
          ? (acc.completedCount += 1)
          : acc.completedCount;
        return acc;
      },
      {
        totalCount: 0,
        completedCount: 0,
        newCount: 0,
        progressCount: 0,
      }
    );

    return counter;
  },
}));
