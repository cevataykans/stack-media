import { User } from "../Model/User/User";
import { Media } from "../Model/Media/Media";
import { Genre } from "../Model/Genre/Genre";
import { Channel } from "../Model/Channel/Channel";
import {Database} from "../Database";
import {AlreadyExist} from "../Model/Error/AlreadyExist";
import {v1 as id} from "uuid";

export class ChannelDBService {
    db: Database;

    constructor(){
        this.db = new Database();
    }

    public async getMoviesFromChannel(channel: Channel): Promise<any> {
        let result = null;

        let sqlQuery = "SELECT MO.* FROM Media M, ChannelMeadia CM, Movie MO WHERE ChannelMedia.channelId = '" + channel.channelId + "' AND M.mediaId = CM.mediaId AND M.mediaId = MO.mediaId;";

        try {
            result = await this.db.sendQuery(sqlQuery);
        } 
        catch(err){
            throw err;
        }
        return result;
    }

    public async getSeriesFromChannel(channel: Channel): Promise<any> {
        let result = null;

        let sqlQuery = "SELECT TV.* FROM Media M, ChannelMeadia CM, TVSeriesEpisode TV WHERE ChannelMedia.channelId = '" + channel.channelId + "' AND M.mediaId = CM.mediaId AND M.mediaId = TV.mediaId;";

        try {
            result = await this.db.sendQuery(sqlQuery);
        } 
        catch(err){
            throw err;
        }
        return result;
    }

    public async getMovieSuggestionForChannel(channel: Channel): Promise<any> {
        let result = null;

        let sqlQuery = "SELECT MO.* FROM Media M, MediaHasGenre MHG, Movie MO WHERE M.mediaId = MHG.mediaId AND M.mediaId = MO.mediaId AND MHG.genreId IN" 
                     + "(SELECT genreId FROM ChannelHasGenre WHERE channelId = '" + channel.channelId + "');";

        try {
            result = await this.db.sendQuery(sqlQuery);
        } 
        catch(err){
            throw err;
        }
        return result;
    }

    public async getSeriesSuggestionForChannel(channel: Channel): Promise<any> {
        let result = null;

        let sqlQuery = "SELECT TV.* FROM Media M, MediaHasGenre MHG, TVSeriesEpisode TV WHERE M.mediaId = MHG.mediaId AND M.mediaId = MO.mediaId AND MHG.genreId IN" 
                     + "(SELECT genreId FROM ChannelHasGenre WHERE channelId = '" + channel.channelId + "');";

        try {
            result = await this.db.sendQuery(sqlQuery);
        } 
        catch(err){
            throw err;
        }
        return result;
    }

    public async addGenreToChannel(channel: Channel, genre: Genre): Promise<any> {
        let result = null;

        let sqlQuery = "INSERT INTO ChannelHasGenre VALUES('" + channel.channelId + "', '" + genre.genreId + "');";

        try {
            await this.db.sendQuery(sqlQuery);
        } 
        catch(err){
            if(err.code == "ER_DUP_ENTRY"){
                throw new AlreadyExist();
            }
            else{
                throw err;
            }
        }
        return result;
    }

    public async deleteGenreFromChannel(channel: Channel, genre: Genre): Promise<any> {
        let result = null;

        let sqlQuery = "DELETE FROM ChannelHasGenre WHERE channelId = '" + channel.channelId + "' AND genreId = '" + genre.genreId + "';";

        try {
            await this.db.sendQuery(sqlQuery);
        } 
        catch(err){
            throw err;
        }
        return result;
    }

    public async addMediaToChannel(channel: Channel, media: Media): Promise<any> {
        let result = null;
        console.log( "Hello");
        let sqlQuery = "INSERT INTO ChannelMedia VALUES('" + media.mediaId + "', '" + channel.channelId + "');";

        try {
            await this.db.sendQuery(sqlQuery);
        } 
        catch(err){
            if(err.code == "ER_DUP_ENTRY"){
                throw new AlreadyExist();
            }
            else{
                throw err;
            }
        }
        return result;
    }

    public async deleteMediaFromChannel(channel: Channel, media: Media): Promise<any> {
        let result = null;

        let sqlQuery = "DELETE FROM ChannelMedia WHERE channelId = '" + media.mediaId + "' AND genreId = '" + channel.channelId + "';";

        try {
            await this.db.sendQuery(sqlQuery);
        } 
        catch(err){
            throw err;
        }
        return result;
    }

    public async createChannel(channel: Channel): Promise<any> {
        let channelId = id();
        let sqlQuery = "INSERT INTO Channel VALUES('" + channelId + "', '" + channel.username + "', '" + channel.title + "');";

        try {
            await this.db.sendQuery(sqlQuery);
        } 
        catch(err){
            if(err.code == "ER_DUP_ENTRY"){
                throw new AlreadyExist();
            }
            else{
                throw err;
            }
        }
        return channelId;
    }

    public async deleteChannel(channel: Channel): Promise<any> {
        let result = null;

        let sqlQuery = "DELETE FROM Channel WHERE channelId = '" + channel.channelId + "' AND username = '" + channel.username + "';";

        try {
            await this.db.sendQuery(sqlQuery);
        } 
        catch(err){
            throw err;
        }
        return result;
    }
}