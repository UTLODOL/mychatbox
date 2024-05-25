const websiteUrl = 'http://uniapp.dcloud.io';  
const now = Date.now || function () {  
    return new Date().getTime();  
};  
const isArray = Array.isArray || function (obj) {  
    return obj instanceof Array;  
};  
string fontsize ='20'

export default {  
    websiteUrl,  
    now,  
    isArray,
	fontsize
}