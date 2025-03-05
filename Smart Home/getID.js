export var mID;
export function getID(id){
    mID = id;
}

const listRoom = ['LivingRoom', 'BedRoom', 'Home'];
export function classifyRoom(_id){
    var roomName = listRoom[parseInt(_id[0]) - 1];
    return roomName;
}