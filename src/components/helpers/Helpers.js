export function GetComments(score) {
    if(score <= 5){
        return "you are just embarrrrassing yourself!"
    }

    if(score >= 5 && score < 10){
        return "see, you will end up in mcdonalds!"
    }

    if(score >= 10 && score < 15){
        return "baldadashhh mtchew"
    }

    if(score >= 15 && score < 20){
        return "you are doing wehhll"
    }

    if(score >= 20 && score < 25){
        return "fantabulous"
    }

    if(score >= 25 && score < 30){
        return "you have too much pride, try to be calming down"
    }

    if(score >= 30 && score < 35){
        return "nice, we love to see it!"
    }
}

export function CleanLine(string){
    if (string != undefined){
        return string.substr(10).toLowerCase().replace("by rentanadvisercom", '***').replace("ing soon", 'no dey do like bolo')
    }
    return ""
}

export function ShuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}