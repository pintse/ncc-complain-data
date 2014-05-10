/**
 * ChannelController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
var _ = require('underscore');

module.exports = {

    index: function(req, res) {
        var channels = {};
        Complain.find().exec(function(err, results) {
            results.forEach(function(e) {
                if (!channels[e.channelName]) {
                    channels[e.channelName] = {
                        size:0,
                    };
                }
                if (!channels[e.channelName][e.complainCategory]) {
                    channels[e.channelName][e.complainCategory] = [];
                }
                channels[e.channelName][e.complainCategory].push(e);
                channels[e.channelName].size ++;
            });
            channelArray = [];
            for (key in channels) {
                var category = [];
                for (var categoryKey in channels[key]) {
                    if (categoryKey=='size') continue;
                    category.push({
                        categoryName: categoryKey,
                        data: channels[key][categoryKey],
                    });
                }
                category = _.sortBy(category, function(e) {
                    return e.data.length;
                });
                channelArray.push({
                    channelName: key,
                    category: category,
                    size: channels[key].size,
                });
            }
            channels = _.sortBy(channelArray, function(channel) {return -channel.size});
            res.json(channels);
        });
    },

    /**
     * Overrides for the settings in `config/controllers.js`
     * (specific to ChannelController)
     */
    _config: {}

};