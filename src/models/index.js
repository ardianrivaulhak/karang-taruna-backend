import MobileVersion from "./MobileVersion";
import Setting from "./Setting";
import User from "./User";
import Member from "./Member";
import Notification from "./Notification";
import Otp from "./Otp";
import Branch from "./Branch";
import BranchRating from "./BranchRating";
import Province from "./Province";
import City from "./City";
import District from "./District";
import Village from "./Village";
import Approval from "./Approval";
import Record from "./Record";
import Event from "./Event";
import News from "./News";
import NewsSavedByMember from "./NewsSavedByMember";
import NewsImage from "./NewsImage";
import Category from "./Category";

import Post from "./Post";
import CommunityNotification from "./CommunityNotification";
import Comment from "./Comment";
import Like from "./Like";
import Job from "./Jobs";
import Position from "./Position";
import Level from "./Level";
import Declined from "./Declined";
import Role from "./Role";
import UserHasRole from "./userHasRole";

import Survey from "./Survey";
import Potential from "./Potential";
import SurverPotential from "./SurveyPotential";
import BranchHasPosition from "./BranchHasPosition";

console.log("Start synchronizing models");

await Job.sync({ alter: false });
await Position.sync({ alter: false });
await Level.sync({ alter: false });
await Province.sync({ alter: false });
await City.sync({ alter: false });
await District.sync({ alter: false });
await Village.sync({ alter: false });

await Branch.sync({ alter: false });
await User.sync({ alter: false });
await Member.sync({ alter: false });
await BranchRating.sync({ alter: false });
await Otp.sync({ alter: false });
await Event.sync({ alter: false });
await News.sync({ alter: false });
await Notification.sync({ alter: false });
await MobileVersion.sync({ alter: false });
await Setting.sync({ alter: false });
await Record.sync({ alter: false });
await Post.sync({ alter: false });
await CommunityNotification.sync({ alter: false });
await Comment.sync({ alter: false });
await Like.sync({ alter: false });
await Category.sync({ alter: false });
await NewsSavedByMember.sync({ alter: false });
await NewsImage.sync({ alter: false });
await Declined.sync({ alter: false });
await Role.sync({ alter: false });
await UserHasRole.sync({ alter: false });
await Potential.sync({ alter: false });
await Survey.sync({ alter: false });
await SurverPotential.sync({ alter: false });
await Approval.sync({ alter: false });
await BranchHasPosition.sync({ alter: false });
console.log("All models were synchronized successfully.");

City.belongsTo(Province, {
  foreignKey: "province_id",
});
Province.hasMany(City, {
  foreignKey: "province_id",
});
District.belongsTo(City, {
  foreignKey: "city_id",
});
City.hasMany(District, {
  foreignKey: "city_id",
});
Village.belongsTo(District, {
  foreignKey: "district_id",
});
District.hasMany(Village, {
  foreignKey: "district_id",
});
Branch.belongsTo(Village, {
  foreignKey: "village_id",
});
Branch.hasMany(Member, {
  foreignKey: "branch_id",
});
Member.belongsTo(Branch, {
  foreignKey: "branch_id",
});
Member.belongsTo(Village, {
  foreignKey: "village_id",
});
Village.hasMany(Member, {
  foreignKey: "village_id",
});
Village.hasMany(Branch, {
  foreignKey: "village_id",
});
BranchRating.belongsTo(Branch, {
  foreignKey: "branch_id",
});
BranchRating.belongsTo(Member, {
  foreignKey: "member_id",
});
Branch.hasMany(BranchRating, {
  foreignKey: "branch_id",
});
Member.hasMany(BranchRating, {
  foreignKey: "member_id",
});
User.hasOne(Member, {
  foreignKey: "user_id",
});
Member.belongsTo(User, {
  foreignKey: "user_id",
});
Otp.belongsTo(User, {
  foreignKey: "user_id",
});
User.hasMany(Otp, {
  foreignKey: "user_id",
});
Notification.belongsTo(Member, {
  foreignKey: "member_id",
});
Member.hasMany(Notification, {
  foreignKey: "member_id",
});

Event.belongsTo(Approval, {
  foreignKey: "approval_id",
});
Approval.hasOne(Event, {
  foreignKey: "approval_id",
});
News.belongsTo(Approval, {
  foreignKey: "approval_id",
});
Approval.hasOne(News, {
  foreignKey: "approval_id",
});

Event.belongsTo(Member, {
  foreignKey: "member_id",
});

Member.hasMany(Event, { foreignKey: "member_id" });

// News.belongsToMany(Member, {
//   through: "news_saved_by_users",
//   foreignKey: "member_id",
// });

Member.hasMany(News, {
  // through: "news_saved_by_users",
  foreignKey: "member_id",
});

News.belongsTo(Member, {
  // through: "news_saved_by_users",
  foreignKey: "member_id",
});

Member.hasMany(News, {
  // through: "news_saved_by_users",
  foreignKey: "member_id",
});

News.hasMany(NewsSavedByMember, {
  foreignKey: "news_id",
});

NewsSavedByMember.belongsTo(News, {
  foreignKey: "news_id",
});

Member.hasMany(NewsSavedByMember, {
  foreignKey: "member_id",
});

NewsSavedByMember.belongsTo(Member, {
  foreignKey: "member_id",
});

// Member.belongsToMany(News, {
//   through: "event_saved_by_users",
//   foreignKey: "member_id",
// });
NewsImage.belongsTo(News, {
  foreignKey: "news_id",
});
News.hasMany(NewsImage, {
  foreignKey: "news_id",
});

Post.belongsTo(Member, {
  foreignKey: "member_id",
});
Member.hasMany(Post, {
  foreignKey: "member_id",
});
CommunityNotification.belongsTo(Member, {
  foreignKey: "member_id",
});
CommunityNotification.belongsTo(Member, {
  foreignKey: "reactor_id",
  as: "reactor",
});
Comment.belongsTo(Member, {
  foreignKey: "member_id",
});
Comment.belongsTo(Member, {
  foreignKey: "reply_of_id",
  as: "reply_of",
});
Comment.belongsTo(Post, {
  foreignKey: "post_id",
});
Member.hasMany(Comment, {
  foreignKey: "member_id",
});
Post.hasMany(Comment, {
  foreignKey: "post_id",
});
Like.belongsTo(Member, {
  foreignKey: "member_id",
});
Like.belongsTo(Post, {
  foreignKey: "post_id",
});
Like.belongsTo(Comment, {
  foreignKey: "comment_id",
});
Member.hasMany(Like, {
  foreignKey: "member_id",
});
Post.hasMany(Like, {
  foreignKey: "post_id",
});
Comment.hasMany(Like, {
  foreignKey: "comment_id",
});
Member.belongsTo(Job, {
  as: "Job",
  foreignKey: "job_id",
});

Job.hasMany(Member, {
  foreignKey: "job_id",
});

Member.belongsTo(Level, {
  foreignKey: "level_id",
});
Member.belongsTo(Position, {
  foreignKey: "position_id",
});

Level.hasMany(Member, {
  foreignKey: "level_id",
});
Position.hasMany(Member, {
  foreignKey: "position_id",
});

News.hasMany(Notification, {
  foreignKey: "news_id",
});

Notification.belongsTo(News, {
  foreignKey: "news_id",
});

Event.hasMany(Notification, {
  foreignKey: "event_id",
});

Notification.belongsTo(Event, {
  foreignKey: "event_id",
});
News.belongsTo(Category, {
  foreignKey: "category_id",
});

Category.hasMany(News, {
  foreignKey: "category_id",
});

Event.belongsTo(Member, {
  foreignKey: "member_id",
});

Member.hasMany(Event, {
  foreignKey: "member_id",
});

User.belongsToMany(Role, {
  through: UserHasRole,
  foreignKey: "user_id",
});

Role.belongsToMany(User, {
  through: UserHasRole,
  foreignKey: "role_id",
});

Potential.belongsToMany(Survey, {
  through: SurverPotential,
  foreignKey: "potential_id",
});
Survey.belongsToMany(Potential, {
  through: SurverPotential,
  foreignKey: "survey_id",
  as: "potentials",
});
SurverPotential.belongsTo(Potential, {
  foreignKey: "potential_id",
  as: "potential",
});
SurverPotential.belongsTo(Survey, {
  foreignKey: "survey_id",
});
Potential.hasMany(SurverPotential, {
  foreignKey: "potential_id",
});
Survey.hasMany(SurverPotential, {
  foreignKey: "survey_id",
});

Declined.hasMany(Approval, {
  foreignKey: "declined_id",
});

Approval.belongsTo(Declined, {
  foreignKey: "declined_id",
});

User.hasMany(Approval, {
  foreignKey: "user_id",
});

Approval.belongsTo(User, {
  foreignKey: "user_id",
});

Branch.belongsTo(Level, {
  foreignKey: "level_id",
});

Level.hasMany(Branch, {
  foreignKey: "level_id",
});

Branch.belongsToMany(Position, {
  through: BranchHasPosition,
  foreignKey: "branch_id",
});

Position.belongsToMany(Branch, {
  through: BranchHasPosition,
  foreignKey: "position_id",
});

Member.hasMany(Survey, {
  foreignKey: "member_id",
});

Survey.belongsTo(Member, {
  foreignKey: "member_id",
});

export {
  User,
  Member,
  Setting,
  MobileVersion,
  Notification,
  Otp,
  Branch,
  BranchRating,
  Province,
  City,
  District,
  Village,
  Approval,
  Record,
  Event,
  News,
  NewsSavedByMember,
  NewsImage,
  Category,
  Post,
  CommunityNotification,
  Comment,
  Like,
  Job,
  Position,
  Level,
  Declined,
  Role,
  UserHasRole,
  Potential,
  Survey,
  SurverPotential,
};
