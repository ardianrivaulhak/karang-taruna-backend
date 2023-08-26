import moment from "moment";
import {
  Branch,
  Comment,
  CommunityNotification,
  Like,
  Member,
  Post,
  User,
} from "../models";
import sequelize from "../models/sequelize";
import Messaging from "../services/Messaging";

class CommunityController {
  async createPost(req, res) {
    try {
      const payloadPost = {
        member_id: req.auth.user.Member.id,
        body: req.body.content,
        date: moment().toDate(),
      };
      const createdPost = await Post.create(payloadPost);
      return res.status(201).json({
        message: "Success",
        data: createdPost,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed",
        error: error.message,
      });
    }
  }

  async getPosts(req, res) {
    try {
      const { sort = "lastest" } = req.query;
      let order = [["created_at", "DESC"]];
      if (sort === "populer") {
        order = [
          [
            sequelize.literal(`COUNT("Comments"."id") + COUNT("Likes"."id")`),
            "DESC",
          ],
        ];
      }
      const posts = await Post.findAll({
        order: [["created_at", "DESC"]],
        include: [
          {
            model: Member,
            attributes: ["id", "name", "photo_url", "username"],
          },
          {
            model: Comment,
            required: false,
          },
          {
            model: Like,
            required: false,
          },
        ],
        group: ["Post.id", "Comments.id", "Likes.id", "Member.id"],
        order,
      });
      const mappedData = posts.map((post) => {
        const likes = post.Likes.map((el) => {
          return el;
        });

        return {
          post_id: post.id,
          member_id: post.member_id,
          member_name: post.Member.name,
          member_username: post.Member.username,
          member_photo_url: post.Member.photo_url,
          date: moment(post.date).locale("id").format("DD MMM YY, HH:mm"),
          content: post.body,
          comments_count: post.Comments.length,
          likes_count: post.Likes.length,
          isLike: !!post.Likes.find(
            (el) => el.member_id === req.auth.user.Member.id
          ),
          is_saved_by_me: post.Likes.length > 0,
        };
      });
      return res.status(200).json({
        message: "Success",
        data: mappedData,
      });
    } catch (error) {
      console.log("Get Posts Failure ===> " + error);
      return res.status(500).json({
        message: "Failed",
        error: error.message,
      });
    }
  }

  async getPostsByMember(req, res) {
    try {
      const { member_id } = req.params;
      const posts = await Post.findAll({
        where: {
          member_id,
        },
        order: [["created_at", "DESC"]],
        include: [
          {
            model: Member,
            attributes: ["id", "name", "photo_url"],
          },
          {
            model: Comment,
          },
          {
            model: Like,
          },
        ],
      });
      const mappedData = posts.map((post) => {
        return {
          post_id: post.id,
          member_id: post.member_id,
          member_name: post.Member.name,
          member_photo_url: post.Member.photo_url,
          date: moment(post.date).locale("id").format("DD MMM YY, HH:mm"),
          content: post.body,
          comments_count: post.Comments.length,
          likes_count: post.Likes.length,
        };
      });
      return res.status(200).json({
        message: "Success",
        data: mappedData,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed",
        error: error.message,
      });
    }
  }

  async getCommentsPost(req, res) {
    try {
      const { post_id } = req.params;
      const comments = await Comment.findAll({
        where: { post_id },
        include: [
          {
            model: Member,
            attributes: ["id", "name", "photo_url", "username"],
          },
          {
            model: Member,
            attributes: ["id", "name", "photo_url", "username"],
            as: "reply_of",
          },
          {
            model: Like,
          },
        ],
        order: [["date", "DESC"]],
      });
      const mappedData = comments.map((comment) => {
        const _comment = comment.toJSON();
        return {
          comment_id: _comment.id,
          member_id: _comment.member_id,
          member_name: _comment.Member.name,
          member_username: _comment.Member.username,
          member_photo_url: _comment.Member.photo_url,
          date: moment(_comment.date).locale("id").format("DD MMM YY, HH:mm"),
          reply_of_id: _comment.reply_of_id ?? "-",
          reply_of_name: _comment.reply_of?.name ?? "-",
          reply_of_username: _comment.reply_of?.username ?? "-",
          reply_of_photo_url: _comment.reply_of?.photo_url ?? "-",
          content: _comment.body,
          likes_count: _comment.Likes.length,
        };
      });
      return res.status(200).json({
        message: "Success",
        data: mappedData,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed",
        error: error.message,
      });
    }
  }

  async commentingPost(req, res) {
    const t = await sequelize.transaction();
    try {
      const { content, reply_of_id } = req.body;
      const { post_id } = req.params;
      const fcmUserToken = [];
      const post = await Post.findByPk(post_id, {
        include: {
          model: Member,
          attributes: ["id", "user_id"],
          include: {
            model: User,
          },
        },
        transaction: t,
      });
      if (!post) {
        await t.rollback();
        return res.status(404).json({
          message: "Post not found!",
        });
      }

      const _post = post.toJSON();
      if (_post.Member.User.fcm_token)
        fcmUserToken.push(_post.Member.User.fcm_token);
      const payloadComment = {
        member_id: req.auth.user.Member.id,
        post_id: post_id,
        body: content,
        date: moment().toDate(),
      };
      if (reply_of_id) {
        const member = await Member.findByPk(reply_of_id, {
          include: { model: User },
          transaction: t,
        });
        if (!member) {
          await t.rollback();
          return res.status(404).json({
            message: "Member tag not found!",
          });
        }
        const _member = member.toJSON();
        payloadComment.reply_of_id = reply_of_id;
        const notificationPayload = {
          member_id: _member.id,
          reactor_id: req.auth.user.Member.id,
          post_id,
          type: "mention",
        };
        await CommunityNotification.create(notificationPayload, {
          transaction: t,
        });
        if (_member.User.fcm_token) {
          Messaging.sendToToken([_member.User.fcm_token], {
            title: "Karang Taruna Community",
            body: _member.name + " menyebut kamu dalam Comment",
          });
        }
      }

      const createdComment = await Comment.create(payloadComment, {
        transaction: t,
      });
      const notificationPayload = {
        member_id: _post.Member.id,
        reactor_id: req.auth.user.Member.id,
        post_id,
        type: "comment",
      };
      await CommunityNotification.create(notificationPayload, {
        transaction: t,
      });
      if (_post.Member.User.fcm_token) {
        Messaging.sendToToken([_post.Member.User.fcm_token], {
          title: "Karang Taruna Community",
          body: req.auth.user.name + " Mengomentari Postinganmu",
        });
      }
      await t.commit();
      return res.status(201).json({
        message: "Success",
        data: createdComment,
      });
    } catch (error) {
      await t.rollback();
      return res.status(500).json({
        message: "Failed",
        error: error.message,
      });
    }
  }

  async likingPost(req, res) {
    const t = await sequelize.transaction();
    try {
      const { post_id = null, comment_id = null } = req.body;
      let post;
      let comment;
      if ((post_id && comment_id) || (!post_id && !comment_id)) {
        return res.status(422).json({
          message: "Choose parent likes between post or comment",
        });
      }
      if (post_id) {
        post = await Post.findByPk(post_id, {
          include: {
            model: Member,
            attributes: ["id", "user_id"],
            include: {
              model: User,
            },
          },
          transaction: t,
        });
        if (!post) {
          return res.status(422).json({
            message: "Post not found!",
          });
        }
      } else if (comment_id) {
        comment = await Comment.findByPk(comment_id, {
          include: {
            model: Member,
            attributes: ["id", "user_id"],
            include: {
              model: User,
            },
          },
          transaction: t,
        });
        if (!comment) {
          return res.status(422).json({
            message: "Comment not found!",
          });
        }
      }

      const _post = post ? post.toJSON() : null;
      const _comment = comment ? comment.toJSON() : null;
      const payloadLike = {
        member_id: req.auth.user.Member.id,
        post_id,
        comment_id,
        date: moment().toDate(),
      };
      const [like, createdLike] = await Like.findOrCreate({
        where: {
          member_id: req.auth.user.Member.id,
          post_id,
        },
        defaults: payloadLike,
      });
      if (!createdLike) {
        return res.status(422).json({
          message: "You already liked this post",
        });
      }
      const notificationPayload = {
        member_id: _post ? _post.Member.id : _comment.Member.id,
        reactor_id: req.auth.user.Member.id,
        post_id,
        type: "like",
      };
      await CommunityNotification.create(notificationPayload, {
        transaction: t,
      });
      const fcmUserToken = post
        ? _post.Member.User.fcm_token
        : _comment.Member.User.fcm_token;
      if (_post.Member.User.fcm_token) {
        Messaging.sendToToken([fcmUserToken], {
          title: "Karang Taruna Community",
          body:
            req.auth.user.name + " Menyukai" + post
              ? " Postinganmu"
              : " Komentarmu",
        });
      }
      await t.commit();
      return res.status(201).json({
        message: "Success",
        data: like,
      });
    } catch (error) {
      await t.rollback();
      return res.status(500).json({
        message: "Failed",
        error: error.message,
      });
    }
  }

  async unLikingPost(req, res) {
    try {
      const { post_id } = req.params;
      const like = await Like.findOne({
        where: {
          member_id: req.auth.user.Member.id,
          post_id,
        },
      });
      if (!like) {
        return res.status(422).json({
          message: "You not liked this post",
        });
      }
      await like.destroy();

      return res.status(200).json({
        message: "Success unlike post",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed",
        error: error.message,
      });
    }
  }

  async getCountActivity(req, res) {
    try {
      const posts = await Post.count({
        where: { member_id: req.auth.user.Member.id },
      });
      const comments = await Comment.count({
        where: { member_id: req.auth.user.Member.id },
      });
      const likes = await Like.count({
        where: { member_id: req.auth.user.Member.id },
      });

      return res.status(200).json({
        message: "success",
        data: {
          posts,
          likes,
          comments,
        },
      });
    } catch (error) {
      return res.status(500).json({
        message: "failed",
        error: error.message,
      });
    }
  }

  async getMe(req, res) {
    try {
      const member = await Member.findOne({
        where: { id: req.auth.user.Member.id },
        include: {
          model: Branch,
          attributes: ["id", "name"],
        },
      });
      const _member = member.toJSON();

      const data = {
        id: _member.id,
        name: _member.name,
        username: _member.username,
        photo_url: _member.photo_url,
        branch_id: _member.Branch?.id ?? "-",
        branch_name: _member.Branch?.name ?? "-",
      };
      return res.status(200).json({
        message: "success",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        message: "failed",
        error: error.message,
      });
    }
  }

  async getCommunityNotification(req, res) {
    try {
      const notifications = await CommunityNotification.findAll({
        where: {
          member_id: req.auth.user.Member.id,
        },
        include: [
          {
            model: Member,
            attributes: ["id", "name", "photo_url"],
            as: "reactor",
          },
          {
            model: Member,
            attributes: ["id", "name", "photo_url"],
          },
        ],
      });
      const data = notifications.map((el) => {
        return {
          type: el.type,
          reactor_id: el.reactor_id,
          reactor_name: el.reactor.name,
          reactor_photo_url: el.reactor.photo_url,
          post_id: el.post_id,
          date: el.date,
        };
      });

      return res.status(200).json({
        message: "success",
        data,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Failed",
        error: error.message,
      });
    }
  }

  async checkUsername(req, res) {
    return res.status(200).json({
      message: "Username is available",
    });
  }

  async updateUsername(req, res) {
    try {
      const { username } = req.body;
      const member = await Member.findByPk(req.auth.user.Member.id);
      await member.update({ username });
      await member.reload();
      return res.status(200).json({
        message: "success",
        data: member,
      });
    } catch (error) {
      return res.status(500).json({
        message: "failed",
        error: error.message,
      });
    }
  }
}

export default new CommunityController();
