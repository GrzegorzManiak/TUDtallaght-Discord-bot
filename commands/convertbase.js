const bot = require('../source')
let config = bot.getConfig();

exports.command = {
    details: {
        commandName: 'convert',
        commandShortDescription: 'This command converts basses.',
    },

    commandCallback: async function(parameters, interaction, obj = { isSlashCommand: false }) {
        let number = parameters[1],
            baseFrom = parseInt(parameters[2]),
            baseTo = parseInt(parameters[3]);

        function baseAdd(base, int1, int2){
            let add = int1 + int2;
            if(add > base - 1) {
                let int1Arr = int1.toString().split('').reverse(),
                    int2Arr = int2.toString().split('').reverse();

                let longest = 0;
                if(int1Arr.length >= int2Arr.length) longest = int1Arr.length;
                else if(int2Arr.length > int1Arr.length) longest = int2Arr.length;

                let carryOver = 0,
                    i = 0,
                    result = [];

                while(longest >= i | carryOver !== 0){
                    let add = parseInt(int1Arr[i] ?? 0) + parseInt(int2Arr[i] ?? 0) + carryOver;
                    carryOver = Math.floor(add / base);
                    result[i] = add % base;
                    i++;
                }

                let strResults = '';
                result.reverse().forEach(int => strResults += int.toString());
                return parseInt(strResults);
            }
            else return add;
        }

        function baseAdd(base, int1, int2){
            let add = int1 + int2;
            if(add > base - 1) {
                let int1Arr = int1.toString().split('').reverse(),
                    int2Arr = int2.toString().split('').reverse();

                let longest = 0;
                if(int1Arr.length >= int2Arr.length) longest = int1Arr.length;
                else if(int2Arr.length > int1Arr.length) longest = int2Arr.length;

                let carryOver = 0,
                    i = 0,
                    result = [];

                while(longest >= i | carryOver !== 0){
                    let add = parseInt(int1Arr[i] ?? 0) + parseInt(int2Arr[i] ?? 0) + carryOver;
                    carryOver = Math.floor(add / base);
                    result[i] = add % base;
                    i++;
                }

                let strResults = '';
                result.reverse().forEach(int => strResults += int.toString());
                return parseInt(strResults);
            }
            else return add;
        }

        function baseMulti(base, original, int1, int2){
            let addFor = parseInt(convertBase(int1, original, 10)) * 2,
                result = 0;

            for(let i = 0; i < addFor; i++) {
                if(i === 0) result = int2;
                else result = baseAdd(original, int2, result);
            }   
            
            return result;
        }

        let baseToOriginal = baseTo;
        if (baseFrom > baseTo) baseTo = parseInt(convertBase(baseFrom, 10, baseTo));
        
        prev = 0;
        let logArr = [];
        let numSplit = number.split('')
        let i = 0;

        numSplit.forEach(num => {
            num = parseInt(num);
            if(num >= baseToOriginal) num = parseInt(convertBase(num, baseFrom, baseToOriginal));

            if(i === 0) {
                let curString = `${num}x${baseTo}`
                prev = baseMulti(baseTo, baseToOriginal, num, baseFrom)
                logArr[i] = `${curString} = ${prev}`
                mathString = curString;
            }
            else if(i === numSplit.length - 1) {
                let curString = `${mathString}+${num}`
                let now = baseAdd(baseToOriginal, prev, num);
                logArr[i] = `${prev}+${num} = ${now}`
                mathString = curString;
                prev = now;
            }
            else {
                let curString = `(${mathString}+${num})x${baseTo}`
                let add = baseAdd(baseTo, prev, num);
                let now = baseMulti(baseTo, baseToOriginal, baseFrom, add);
                logArr[i] = `(${prev}+${num})x${baseTo} = ${now}`
                mathString = curString;
                prev = now;
            }

            i++;
        });

        let description = '';
        logArr.forEach(val => description += `${val}\n`);

        interaction.reply({ 
            content: `**${number}** in base **${baseFrom}** conversion to base **${baseToOriginal}** using base **${baseToOriginal}** arithmetic: \n**${mathString}** \n${description} \n Result: **${prev}** in base **${baseToOriginal}**`,
            ephemeral: true
        })
    },

    executesInDm: false,
    isSlashCommand: true,
    helpEmbedPage: 0,

    roles: {
        user: global.user,
    },

    parameters: [
        { type: 'number', name: 'convert', description: 'The original value', required: true },
        { type: 'number', name: 'from', description: 'The base you are converting from', required: true },
        { type: 'number', name: 'to', description: 'The base you want to convert to', required: true }
    ]
}

function convertBase(value, from_base, to_base) {
    var range = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/'.split('');
    var from_range = range.slice(0, from_base);
    var to_range = range.slice(0, to_base);
    
    var dec_value = value.toString().split('').reverse().reduce(function (carry, digit, index) {
      if (from_range.indexOf(digit) === -1) throw new Error('Invalid digit `'+digit+'` for base '+from_base+'.');
      return carry += from_range.indexOf(digit) * (Math.pow(from_base, index));
    }, 0);
    
    var new_value = '';
    while (dec_value > 0) {
      new_value = to_range[dec_value % to_base] + new_value;
      dec_value = (dec_value - (dec_value % to_base)) / to_base;
    }
    return new_value || '0';
}