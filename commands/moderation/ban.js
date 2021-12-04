//the ban cmd function
module.exports = {
    //name of cmd that will be used with prefix
    name: 'ban',
    description:"ban a user from the server",
    //other cmds that run the same action
    aliases: ['b'],
    //runs file with the defined vars from index.js
    async run(message, args, Discord, client){
        //if user doesnt have certain per then it replys with missing permission
        if(!message.member.permissions.has('BAN_MEMBER')) return message.reply('Invalid permissions. You need the `BAN MEMBERS` permission')
        //define / get user to ban.. either user mentioned or gets user via id. catch statement catches if their is not a user with that id
        const user = message.mentions.users.first() || client.users.fetch(args[0]).catch(err => {
            return
        })
        //define cancel as a changeable var so you can change it later
        let cancel = false
        //defines the reason for ban
        let reason = args.slice(1).join(" ")
        //checks if their is a reason
        if(!reason) reason = "No Reason Stated"
        //check if is user
        if(!user) return message.reply('Invalid user')
        //checks if user is in the guild if is runs following code
        if(message.guild.members.cache.has(user)) {
            //gets guildmember property
            let usera = message.guild.members.cache.get(user)
            //checks if their role is lower then the role of the the user they tryna ban
            if(message.member.roles.highest.position <= usera.roles.highest.position) {
                message.reply('You cannot ban this user.')
                cancel = true
                return
            }
            //checks if the bot can ban the user
            else if(!usera.bannable) {
                message.reply('I cannot ban this user')
                cancel = true
                return
            }
        }
        //cancels the function / file is cancel is set to true at all
        if(cancel) return;


        //makes the embed
        const embed = new Discord.MessageEmbed()
            .setColor('#FF0000')
            .setTitle('User Banned')
            .addField('**·**Moderator: ', `${message.author}`)
            .addField('**·**User: ', `${user}`)
            .addField('**·**Reason: ', `${reason}`)
            .setFooter(`Successfully banned ${user.tag}`, user.displayAvatarURL({ size: 256, dynamic: true }))
            .setAuthor(`moderator ${message.author.tag}`, message.author.displayAvatarURL({ size: 256, dynamic: true }))
            .setTimestamp()

        //create the guild ban
        await message.guild.bans.create(user, {reason: `banned by ${message.author.tag} / ${message.author.id}\nReason: ${reason}`})
        //send the embed made
        message.reply({embeds: [embed]})
    }
}