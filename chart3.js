
const address = document.querySelector('.address')
const bill = document.querySelector('.bill')
const kwh = document.querySelector('.kwh')

 const commercial = document.querySelector('.comm')
  const residential = document.querySelector('.res')
const getDefault =(commercial) => {  
    let defaults 
    if(commercial.checked){
      defaults = .12
    }else{
      defaults = .25
    }
    return defaults
}

  google.maps.event.addDomListener(window, "load", function () {
    var places = new google.maps.places.Autocomplete(
    document.querySelector(".address")
    ); 
  
  });

const showHide = () =>{
  
  document.querySelector('.please-wait').style.display = 'none'
   document.querySelector('.main').style.display = 'block'
}


 
const savings = (month, year) => {
    let monthly_bill = month
    let cost_kwh
    kwh.value ? cost_kwh = year : 
    cost_kwh = getDefault(commercial) 
     
    let annual_production = (12 * monthly_bill)/ cost_kwh
    let system_size = (annual_production/ 1.46) /1000

    const interest = .07
    const formula = interest/12 * (1 + interest/12) **
     120/((1+ interest/12) ** 120 - 1)
    let costAfterIncentive = system_size * 2000 * .6
    let monthly_finance = costAfterIncentive * formula
    let first_month_saving = monthly_bill - monthly_finance
    let first_year_saving = first_month_saving * 12
    
    document.querySelector('.savings-month').innerText = '$'+Math.round(first_month_saving)
    document.querySelector('.savings-year').innerText = '$'+Math.round(first_year_saving)
    document.querySelector('.savings-month1').innerText = '$'+Math.round(first_month_saving)
    document.querySelector('.savings-year1').innerText = '$'+Math.round(first_year_saving)
    document.querySelector('.system-size').innerText = Math.round(system_size)+' KW'
    document.querySelector('.system-size1').innerText = Math.round(system_size)+' KW'
    document.querySelector('.addr').innerText = address.value
    document.querySelector('.addr1').innerText = address.value
    document.querySelector('.addr2').innerText = address.value 
    chart1(address.value, system_size)
  
   chart2(Number(bill.value), Number(kwh.value))

   document.querySelector('.input').style.display = 'none'
   document.querySelector('.please-wait').style.display = 'block'

   setTimeout(showHide, 2000)
  
}


const getAcAnnual = (annual_production) =>{
  
    document.querySelector('.annual').innerText = Math.round(annual_production.outputs.ac_annual)+' KWh' 
     document.querySelector('.annual1').innerText = Math.round(annual_production.outputs.ac_annual)+' KWh' 
          
    for (let i = 0; i< 12;i++){
      myChart.data.datasets[0].data.push(annual_production.outputs.ac_monthly[i])  
   }   
    myChart.update()
   console.log(annual_production.outputs.ac_monthly)
}


  
   const chart1 = (address,systemCapacity)=>{ 
   
    //fetch('https://developer.nrel.gov/api/pvwatts/v8.json?api_key=3tqiqGVtlbyrfadqyJK0TuxtDrWKF7eA48yUppK4&azimuth=180&system_capacity='+systemCapacity+'&losses=14&array_type=1&module_type=0&gcr=0.4&dc_ac_ratio=1.2&inv_eff=96.0&radius=0&dataset=nsrdb&tilt=10&address='+address+'&soiling=12|4|45|23|9|99|67|12.54|54|9|0|7.6&albedo=0.3&bifaciality=0.7'
    fetch('https://developer.nrel.gov/api/pvwatts/v6.json?api_key=58qxO9wehcnYMDjEoVMiSBhX5LP48ZyUKXNYp4YM&address='+address+'&system_capacity='+systemCapacity+'&azimuth=180&tilt=40&array_type=1&module_type=1&losses=10'
      ).then((response)=> response.json())
        .then((data) =>  getAcAnnual(data))
    
  }  


const chart2 = (month, kwho) =>{
    let monthly_bill = month
    let year_bill = monthly_bill * 12 
    let cost_kwh  
    kwh.value ? cost_kwh =  kwho: 
    cost_kwh = getDefault(commercial) 
    let annual_production = (12 * monthly_bill)/ cost_kwh
    let system_size = (annual_production/ 1.46) /1000
    const interest = .07
    const formula = interest/12 * (1 + interest/12) **
     120/((1+ interest/12) ** 120 - 1)
    let costAfterIncentive = system_size * 2000 * .6
    let monthly_finance = costAfterIncentive * formula

    for (let i =0; i<20; i++){
      if (i < 10){
       myChart2.data.datasets[0].data.push(monthly_finance * 12)
      }else{
        myChart2.data.datasets[0].data.push(0)
      }
    }

     for (let i =0; i<20; i++){
        if(i > 0 ){
          myChart2.data.datasets[1].data.push(myChart2.data.datasets[1].data[i-1] + (myChart2.data.datasets[1].data[i-1] * .025))
       
       }else{
          myChart2.data.datasets[1].data.push(year_bill)
     }
    }
            myChart2.update()
          for (let i = 0; i < 20; i++){
             if(i == 0) {
                 myChart3.data.datasets[0].data.push(myChart2.data.datasets[1].data[i] - myChart2.data.datasets[0].data[i])
             } else if(i > 0 && i < 10){
                 myChart3.data.datasets[0].data.push(myChart2.data.datasets[1].data[i] - myChart2.data.datasets[0].data[i] +  myChart3.data.datasets[0].data[i-1])
             }else{
                myChart3.data.datasets[0].data.push(myChart2.data.datasets[1].data[i] + myChart3.data.datasets[0].data[i-1])
             }
          } 
          myChart3.update()
  }  

  

const getSavings = () =>{
  if(!bill.value || isNaN(bill.value) || (isNaN(kwh.value) && kwh.value)||
        bill.value <= 0 || (kwh.value && kwh.value<=0) ){
        alert('enter correct information')
      }else{
 savings(Number(bill.value), Number(kwh.value))
  }
}

const reset = () =>{
    location.reload()
}


const ctx = document.getElementById('chart').getContext('2d');
  
  const bgColor = {
      id:'bgColor',
      beforeDraw: (chart,options) =>{
        const {ctx, width, height} = chart
        ctx.fillStyle = 'white'
        ctx.fillRect(0,0,width,height)
        ctx.restore()
      }
   }
  
  const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Jan','Feb','Mar','Apr','May','Jun',
      'Jul','Aug','Sep','Oct','Nov','Dec'] ,

      
      datasets: [{
        label: 'solar',
        data: [],
        borderWidth: 1,
        backgroundColor: 'orange'
      }]

    },

    options: {
      scales: {
         y: {
          beginAtZero: true,
          title:{
            display : true,
            text: 'KWH  THOUSANDS'
          }
        }
       
        
      }
    },
     plugins: [bgColor]
  });



  
const ctx2 = document.getElementById('chart2').getContext('2d');
    
    let xlabels2 = []
     
  for (let i =0; i< 20;i++){
    xlabels2.push(`year ${i+1}`)
  }
   const bgColor2 = {
      id:'bgColor2',
      beforeDraw: (chart,options) =>{
        const {ctx, width, height} = chart
        ctx.fillStyle = 'white'
        ctx.fillRect(0,0,width,height)
        ctx.restore()
      }
   }
  
  const myChart2 = new Chart(ctx2, {
    type: 'bar',
    data: {
      labels:xlabels2,
      
      datasets: [{
        label: 'Monthly cost with solar financing',
        data: [],
        borderWidth: 1,
        backgroundColor: 'orange'
      },
      {
        label: 'Grid cost no solar',
        data: [],
        borderWidth: 1,
        backgroundColor: 'blue'
      } ]

    },
   
    options: {
      scales: {
        y: {
          beginAtZero: true,
           title:{
            display : true,
            text: 'GRID  COST  NO  SOLAR'
          },
          ticks: {
                    // Include a dollar sign in the ticks
                    callback: function(value, index, ticks) {
                        return '$' + value;
                    }
                }   
        }
      }
    },
    plugins: [bgColor2]
  });
   

const remove = ()=>{
   document.getElementById("chart").remove()
}
   

   const ctx3 = document.getElementById('chart3').getContext('2d');

    let xlabels3 = []
     
  for (let i =0; i< 20;i++){
    xlabels3.push(`year ${i+1}`)
  }

  const bgColor3 = {
      id:'bgColor3',
      beforeDraw: (chart,options) =>{
        const {ctx, width, height} = chart
        ctx.fillStyle = 'white'
        ctx.fillRect(0,0,width,height)
        ctx.restore()
      }
   }

  const myChart3 = new Chart(ctx3, {
    type: 'bar',
    data: {
      labels: xlabels3,

      
      datasets: [{
        label: 'solar',
        data: [],
        borderWidth: 1,
        backgroundColor: 'orange'
      }]
        

    },

    options: {
      scales: {
        y: {
          beginAtZero: true,
          title:{
            display : true,
            text: 'CUMULATIVE  SAVINGS'
          },
           ticks: {
                    // Include a dollar sign in the ticks
                    callback: function(value, index, ticks) {
                        return '$' + value;
                    }
                }      
        }

      }
    },
     plugins: [bgColor3]
  });


  window.onload = function() {
  var c = document.querySelector(".logo");
  var ctx7 = c.getContext("2d");
  var img = document.querySelector(".image");
  img.crossOrigin ='anonymous'
  ctx7.drawImage(img, 10, 10);
  ctx7.fillText('Your energy source',50,137)
}



  const main = document.querySelector('.main')
   

   const a = document.querySelector('.design')
    const ctx5=a.getContext('2d')
    ctx5.beginPath()
    ctx5.moveTo(0,20)
    ctx5.lineTo(400,50)
    ctx5.lineTo(400,70)
    ctx5.lineTo(0,40)
    ctx5.stroke()
    ctx5.fill()
    ctx5.beginPath()
    ctx5.fillStyle = 'red'
    ctx5.moveTo(0,40)
    ctx5.lineTo(400,70)
    ctx5.lineTo(400,100)
    ctx5.lineTo(0,100)
    ctx5.stroke()
    ctx5.fill()
    
    ctx5.beginPath()
    ctx5.fillStyle = 'white'
    ctx5.moveTo(0,0)
    ctx5.lineTo(400,0)
    ctx5.lineTo(400,50)
    ctx5.lineTo(0,20)
    ctx5.stroke()
    ctx5.fill()

 var specialElementHandlers = {
      '#editor':function(element, renderer){
        return true
      }
    }



function download(){
    const canvas = document.getElementById('chart')
    const canvasImg = canvas.toDataURL('image/jpeg', 1.0)
    const canvas2 = document.getElementById('chart2')
    const canvasImg2 = canvas2.toDataURL('image/jpeg', 1.0)
    const canvas3 = document.getElementById('chart3')
    const canvasImg3 = canvas3.toDataURL('image/jpeg', 1.0)
    const canvas4 = document.querySelector('.design')
    const canvasImg4 = canvas4.toDataURL('image/jpeg', 1.0)
    const canvas5 = document.querySelector('.logo')
    const canvasImg5 = canvas5.toDataURL('image/jpeg', 1.0)
    
   
    let pdf = new jsPDF('p')
    pdf.addImage(canvasImg5, 'JPEG', 20,30, 33, 33)
    pdf.fromHTML(document.querySelector('.huge-header'), 20, 140,{
      'width':170,
      'elementHandlers':specialElementHandlers
    })
    pdf.addImage(canvasImg4, 'JPEG', 0,265, 225, 33)
    pdf.addPage()
    pdf.fromHTML(document.querySelector('.pdf'), 20,20,{
      'width':170,
      'elementHandlers':specialElementHandlers
    })
    pdf.setFillColor(255,0,0)
    pdf.rect(0,294,225,4,'F')
    pdf.addPage()
    /*
    pdf.setFontSize(20)
   
    pdf.text(100,20,'Savings first month:')
    pdf.fromHTML(document.querySelector('.savings-month'),140,20)
    pdf.text(100, 40,'Savings first year:')
    pdf.fromHTML(document.querySelector('.savings-year'), 140,40)
   
    pdf.setFontSize(25)
    pdf.text(15,60, 'Monthly Production')
     pdf.setFontSize(20)
     pdf.text(15,75, 'System Size')
     pdf.fromHTML( document.querySelector('.system-size'),15,75)
     
     pdf.text(15,95, 'Annual Production')

     pdf.fromHTML( document.querySelector('.annual'),15,95)
     */
     pdf.fromHTML(document.querySelector('.pdf1'),10,10)
    pdf.addImage(canvasImg, 'JPEG',100, 60, 100, 95)
    pdf.setFillColor(255,0,0)
    pdf.rect(0,294,225,4,'F')
    pdf.addPage()
    pdf.setFontSize(18)
    
    pdf.text(10, 20,'Grid cost no solar vs. Monthly Cost with Solar with Financing')
    pdf.addImage(canvasImg2, 'JPEG', 10, 35, 165, 110)
    //pdf.addPage()
    pdf.text(10,160,'Cumulative Savings Over 20 Years')
    pdf.addImage(canvasImg3, 'JPEG', 10, 170, 165, 110)
    pdf.setFillColor(255,0,0)
    pdf.rect(0,294,225,4,'F')
    pdf.save('solar.pdf')
}

//format numbers
//date
//validate address
//loading icon
//lower graph