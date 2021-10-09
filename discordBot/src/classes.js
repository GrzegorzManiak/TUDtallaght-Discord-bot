exports.user = class user {
    #client = undefined;
    #user = undefined;
    #guild = undefined;

    constructor(userIdentifier, guildIdentifier, client){
        this.#client = client;
        this.#guild = client?.guilds?.cache?.get(guildIdentifier); // get the guild
        this.#user = this.#guild?.members?.fetch(userIdentifier); // get the user
    }

    getUser(){
        return this.#user.then((usr) => {
            return usr;
        });
    }

    getGuild(){
        return this.#guild;
    }

    sendMessage(content){
        return this.#user.then((usr) => {
            return usr.send(content);
        });
    }

    //--// ROLES //--//
    hasRoles(requiredRoles){
        return this.#user.then(() => {
            let pass = false;
            return this.getRolesName().then((roles) => {
                // set the user roles array to lowercase, just incase the inputs are weirdly capatalized.
                roles = roles.map(r => r.toLowerCase());

                if(Array.isArray(requiredRoles) === true) {
                    // Set the requiredRoles array to lowercase
                    requiredRoles = requiredRoles.map(role => role.toLowerCase());

                    // Go trough each role and check if it matches any of the roles in the required roles array
                    roles.forEach((givenRole) => {

                        // If both arrays share a role, set pass to true which will later be returned
                        if(requiredRoles.includes(givenRole)) pass = true;
                    });
                }
                else if(roles.includes(requiredRoles.toLowerCase())) pass = true;

                return pass;
            });
        })
    }

    getRoles(){
        return this.#user.then((usr) => {
            let roles = [];
            usr.roles.cache.map(role => roles = [...roles, role]);
            return roles;
        })
    }

    getRolesId(){
        return this.#user.then((usr) => {
            let roles = [];
            usr.roles.cache.map(role => roles = [...roles, role.id]);
            return roles;
        })
    }

    getRolesName(){
        return this.#user.then((usr) => {
            let roles = [];
            usr.roles.cache.map(role => roles = [...roles, role.name]);
            return roles;
        })
    }
    //--// END //--//
};

exports.message = class message {
    #message = undefined;
    #client = undefined;

    constructor(message, client){
        this.#client = client;
        this.#message = message.fetch();
    }

    delete(){
        return this.#message.then((msg) => {
            return msg.delete()
                .then(() => { return true; })
                .catch((err) => { return err; })
        });
    }

    getGuild(){
        return this.#message.then((msg) => {
            return msg.guild;
        });
    }

    getUser(){
        return this.#message.then((msg) => {
            return msg.author || msg.user;
        });
    }
}