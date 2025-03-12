/**
 * @Author: John Isaacs <john>
 * @Date:   14-Feb-192019
 * @Filename: timer.js
 * @Last modified by:   john
 * @Last modified time: 14-Feb-192019
 */

setCountdown(15, Boom);

function setCountdown(delay, callback) {
  setTimeout(function() {
      console.log("boom");
      callback(); 
  }, delay * 1000);

  var secondsleft = delay - 1;

  var counter = setInterval(function() {
      document.getElementById('countdown').innerHTML = secondsleft--;
      if (secondsleft < 0) {
          clearInterval(counter);
      }
  }, 1000);
}

function Boom() {
  document.getElementById('alarm').innerHTML = "boom"; 
  document.getElementById('alarmimage').src = 'alarm.jpg'; 
}


