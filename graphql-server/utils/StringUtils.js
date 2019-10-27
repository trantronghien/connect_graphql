const isMail = (email) =>{
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const isAudioFile = (ext) => {
    var regexAudio = /\.(?:wav|mp3)$/i
    return regexAudio.test(String(ext).toLowerCase());
}

exports.isMail = isMail;
exports.isAudioFile = isAudioFile;