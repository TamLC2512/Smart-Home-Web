const firebaseConfig = {
    apiKey: "AIzaSyBeEI1xcvb9rHlcsRt2FVcZwDRz6FFo1GQ",
    authDomain: "homeiot-35360.firebaseapp.com",
    databaseURL: "https://homeiot-35360-default-rtdb.firebaseio.com",
    projectId: "homeiot-35360",
    storageBucket: "homeiot-35360.appspot.com",
    messagingSenderId: "119025430118",
    appId: "1:119025430118:web:e4b9bcbfc81b80b27607a7"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();


export function setData(path, val){
    firebase.database().ref(path).update({
        STATUS: val,
    });
}
 
const listSensor = ['Fire', 'Humidity', 'Intensity', 'Temperature'];
export function getDataSensor(){
    for (let i = 0; i < listSensor.length; i++) {
        var sensorRef = firebase.database().ref('Sensor/' + listSensor[i]);
        sensorRef.on('value', function(snapshot){
            document.getElementById(listSensor[i]).innerHTML = snapshot.val();
        });
    }
}