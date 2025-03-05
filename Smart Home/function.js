import{
  setData,
  getDataSensor
} from './myFirebase.js';

import{
  getID,
  mID,
  classifyRoom
} from './getID.js';

getDataSensor(); // update data Sensor from Firebase

const livDeviceName = ['Bulb', 'Fan1', 'Fan2', 'Fan3'];
const bedDeviceName = ['Bulb1', 'Bulb2', 'Fan1', 'Fan2', 'Fan3', 'Fan4'];
const homeDeviceName = ['Skylight1', 'Skylight2', 'Skylight3', 'Skylight4', 'Skylight5', 'Skylight6', 'Skylight7',
                    'Bulb1', 'Bulb2', 'Bulb3', 'Bulb4', 'Bulb5', 'Bulb6', 'Bulb7', 'Bulb8',
                    'Window1', 'Window2', 'Window3', 'Window4', 'Window5'];
class Device {
  constructor(name, id) {
    this.id = id;
    this.status = 0;
    this.name = name;
  }
}

const LIV_DEVICE_NUM = livDeviceName.length;
const BED_DEVICE_NUM = bedDeviceName.length;
const HOME_DEVICE_NUM = homeDeviceName.length;

var livDevices = new Array(LIV_DEVICE_NUM);
var bedDevices = new Array(BED_DEVICE_NUM);
var homeDevices = new Array(HOME_DEVICE_NUM);

window.onload = function() {
  for (let i = 0; i < LIV_DEVICE_NUM; i++) {
    livDevices[i] = new Device(livDeviceName[i], 1);
  } 

  for (let i = 0; i < BED_DEVICE_NUM; i++) {
    bedDevices[i] = new Device(bedDeviceName[i], 1);
  } 
  
  for (let i = 0; i < HOME_DEVICE_NUM; i++) {
    homeDevices[i] = new Device(homeDeviceName[i], 1);
  } 
};

var listRoom = [livDevices, bedDevices, homeDevices]; 

function writeWebData(Room, UserID, val){
  // firebase.database().ref(Room + '/').child(UserID).update({
  //   STATUS: val,
  // });
  // console.log("On write data func");
  setData(Room+'/'+UserID, val);
}

function disableToggle(_room, _disable){
  var val;
  if(_disable == 0) val = false;
  else val = true;

  for (let i = 0; i < listRoom[_room-1].length; i++) {
    var checkID = document.getElementById(_room + listRoom[parseInt(_room)-1][i].name);
    // console.log(_room + listRoom[_room-1][i].name);
    checkID.disabled = val;
  }
}

function checkMode(_id){
  var checkBox = document.getElementById(_id);
  var roomName = classifyRoom(_id);
  console.log(roomName + 'Check');
  if(checkBox.checked == true){
    document.getElementById(roomName + 'Check').innerHTML = "ON";
    
    writeWebData(roomName, "AUTO_MODE", 1);
    disableToggle(_id[0], 1);
  }
  else{
    document.getElementById(roomName + 'Check').innerHTML = "OFF";
    writeWebData(roomName, "AUTO_MODE", 0);
    disableToggle(_id[0], 0);
  }
}

function update_Img(_id, _status){ // id = bulb1 -> bulb
  var withNoNumber = _id.replace(/[0-9]/g, '');
  var checkImg = document.getElementById(_id + "_img"); // bulb_img
  var st = "";
  if(_status == 0) st = "off";
  else st = "on";
  var nameDe = st + withNoNumber + ".png"; // onbulb.png
  checkImg.src = "Image/" + nameDe;
}

function update_SW(_nameDevice, _room, _status){
  var _idDevice = _room + _nameDevice; // 1bulb
  var checkDevice = document.getElementById(_idDevice);
  if(_status == 0){
    checkDevice.checked = false;
    update_Img(_idDevice, _status);
  }
  else{
    checkDevice.checked = true;
    update_Img(_idDevice, _status);
  }
}

function writeChipData(_room, _equip, _status){         
  if(_room == 1){
    livDevices[_equip-1].status = _status;
    update_SW(livDevices[_equip-1].name, _room, livDevices[_equip-1].status);
    writeWebData("LivingRoom", livDevices[_equip-1].name, _status);
  }
  else if(_room == 2){
    bedDevices[_equip-1].status = _status;
    update_SW(bedDevices[_equip-1].name, _room, bedDevices[_equip-1].status);
    writeWebData("BedRoom", bedDevices[_equip-1].name, _status);
  }
  else if(_room == 3){
    homeDevices[_equip-1].status = _status;
    update_SW(homeDevices[_equip-1].name, _room, homeDevices[_equip-1].status);
    writeWebData("Home", homeDevices[_equip-1].name, _status);
  }
}

function divideCode(code){
  var equipNum, status, roomNum;
  equipNum = code%100;
  status = (code - equipNum)%1000/100;
  roomNum = Math.floor(code/1000);
  writeChipData(roomNum, equipNum, status);
  console.log(roomNum + "," + equipNum+ "," +status);
}

var changeEquip = firebase.database().ref('ChangeEquip/');
changeEquip.on('value', function(snapshot){
  var code = snapshot.val();
  divideCode(code);
  // console.log(code);
},
  function (error) {
      console.error(error);
  }
);
var checkModeList = ['1Checkmode', '2Checkmode', '3Checkmode'];
for (let i = 0; i < checkModeList.length; i++) {
  const _checkMode = document.getElementById(checkModeList[i]);
  _checkMode.onclick = function() {
    checkMode(checkModeList[i]);
    // checkMode('1Checkmode');
  };
}
// const _checkMode = document.getElementById('2Checkmode');
// _checkMode.onclick = function() {
//   checkMode('2Checkmode')
// }

var livListID = ['1Bulb', '1Fan1', '1Fan2'];
for (let i = 0; i < livListID.length; i++) {
  const sw = document.getElementById(livListID[i]);
  // console.log("for: " + i);
  sw.onclick = function() {
    pressToggle(livListID[i]);
  };
}

var bedListID = ['2Bulb1', '2Fan1']
for (let i = 0; i < bedListID.length; i++) {
  const sw = document.getElementById(bedListID[i]);
  // console.log("for: " + i);
  sw.onclick = function() {
    pressToggle(bedListID[i]);
  };
}

var homeListID = ['3Window1', '3Window2'];
for (let i = 0; i < homeListID.length; i++) {
  const sw = document.getElementById(homeListID[i]);
  // console.log("for: " + i);
  sw.onclick = function() {
    pressToggle(homeListID[i]);
  };
}
function pressToggle(id){
  // console.log("Press bulb switch");
  var checkDevice = document.getElementById(id);
  var room = '';
  var equip = id.slice(1);
  if(id[0] == 1) room = 'LivingRoom';
  else if(id[0] == 2) room = 'BedRoom';
  else if(id[0] == 3) room = 'Home';

  if(checkDevice.checked == true){
    // console.log("checked true");
    writeWebData(room, equip, 1);
    update_Img(id, 1);
    
  }
  else{
    // console.log("checked false");
    writeWebData(room, equip, 0);
    update_Img(id, 0);
    
  }
}


