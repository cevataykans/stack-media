import { User } from "Model/User/User";
import { Media } from "Model/Media/Media";
import { Comment } from "Model/Comment/Comment";
import { connected } from "process";
import { compileFunction } from "vm";
import {Database} from "../Database";
import * as util from "util";

export class UserDBService {

    db: Database;

    constructor(){
        this.db = new Database();
    }

    public async login(email: string, password: string): Promise<any> {
        let result = null;

        let sqlQuery = "SELECT * FROM User WHERE email = '" + email + "' AND password = '" + password + "';";

        try {
            result = await this.db.sendQuery(sqlQuery);
            // TODO
        } 
        catch(err){
            throw err;
        }
        return (result.length == 1);
    }

    public async register(user: User): Promise<any> {
        let result = null;

        let sqlQuery = "INSERT INTO User VALUES('" + user.username + "','" + user.username + "','" + user.email + "','" + user.userType + "','" + user.password + "');"

        try {
            result = await this.db.sendQuery(sqlQuery);
            // TODO
        } 
        catch(err){
            if(err.code == "ER_DUP_ENTRY"){
                throw err;
            }
            throw err;
        }
        return result;
    }

    public async getParties(user: User): Promise<any> {
        let result = null;

        let sqlQuery = "SELECT name AS partyName, partyId FROM Party WHERE creatorUsername = '" + user.username + "';";

        try {
            result = await this.db.sendQuery(sqlQuery);
            // TODO
        } 
        catch(err){
            throw err;
        }
        return result;
    }

    public async getChannels(user: User): Promise<any> {
        let result = null;

        let sqlQuery = "SELECT title AS channelName, channelId FROM User INNER JOIN Channel ON Channel.username = '" + user.username + "';";

        try {
            result = await this.db.sendQuery(sqlQuery);
            // TODO
        } 
        catch(err){
            throw err;
        }
        return result;
    }

    public async getFriendActivities(user: User): Promise<any> {
        let resultFriends = null;
        let resultActivities = null;

        let sqlQuery = "SELECT F.friend2Username, WHERE F.friend1Username = '" + user.username + "';";

        try {
            resultFriends = await this.db.sendQuery(sqlQuery);
            sqlQuery = "SELECT F.friend1Username, WHERE F.friend2Username = '" + user.username + "';";
            resultFriends.concat(await this.db.sendQuery(sqlQuery));
            if (resultFriends.length > 0)
            {
                sqlQuery = "SELECT W.username, M.name FROM , Watch W, Media M WHERE FIND_IN_SET(W.username, " + resultFriends + ") AND W.mediaId = M.mediaId;";
                resultActivities = await this.db.sendQuery(sqlQuery);
            }
            // TODO
        } 
        catch(err){
            throw err;
        }
        return resultActivities;
    }

    public async addFriend(mainUser: User, invitedUser: string): Promise<any> {
        let result = null;

        let sqlQuery = "DELETE FROM FriendshipInvitation WHERE inviterUsername = '" + mainUser.username + "' and invitedUsername = '" + invitedUser + "';"+
                    "\n INSERT INTO Friendship VALUES('" + mainUser.username + "', '" + invitedUser + "');";

        try {
            result = await this.db.sendQuery(sqlQuery);
            // TODO
        } 
        catch(err){
            throw err;
        }
        return result;
    }

    public async deleteFriend(mainUser: User, deletedUser: string): Promise<any> {
        let result = null;

        let sqlQuery = "DELETE FROM Friendship WHERE friend1-id = '" + mainUser.username + "' and friend2-id = '" + deletedUser + "';";

        try {
            result = await this.db.sendQuery(sqlQuery);
            // TODO
        } 
        catch(err){
            throw err;
        }
        return result;
    }

    public async rateMedia(user: User, media: Media, rate: number): Promise<any> {
        let result = null;

        let sqlQuery = "SELECT * FROM MediaRating WHERE Media-id = '" + media.mediaId + "' AND user-id = '" + user.username + "';"

        try {
            result = await this.db.sendQuery(sqlQuery);
            if (result.length == 0)
            {
                sqlQuery = "INSERT INTO MediaRating VALUES('" + user.username + "', '" + media.mediaId + "', " + rate + ");";
            }
            else
            {
                sqlQuery = "UPDATE MediaRating SET rating = " + rate + " WHERE media-id = '" + media.mediaId + "' AND user-id = '" + user.username + "';";
            }
            result = await this.db.sendQuery(sqlQuery);
            // TODO
        } 
        catch(err){
            throw err;
        }
        return result;
    }

    public async addComment(user: User, media: Media, comment: Comment): Promise<any> {
        let result = null;

        let sqlQuery = "INSERT INTO Comment VALUES('" + comment.commentId + "', '" + user.username + "', '" + media.mediaId + "', '" + comment.text + "', '" + comment.timeStamp + "');";

        try {
            result = await this.db.sendQuery(sqlQuery);
            // TODO
        } 
        catch(err){
            throw err;
        }
        return result;
    }

    public async deleteComment(mainUser: User, deletedUser: string): Promise<any> {
        let result = null;

        let sqlQuery = "DELETE FROM Friendship WHERE friend1-id = '" + mainUser.username + "' and friend2-id = '" + deletedUser + "';";

        try {
            result = await this.db.sendQuery(sqlQuery);
            // TODO
        } 
        catch(err){
            throw err;
        }
        return result;
    }
}