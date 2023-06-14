class LineChart{
    constructor(x_title, y_title){
      this.x_list = []
      this.y_list = []
      const data = {
        labels: [],    
        datasets: [{
          label: 'My First Dataset',
          data: [],
          fill: false,
          borderColor: 'rgba(255, 99, 132, 1)',
          tension: 0.1
        }]
      };

      const config = {
        type: 'line',
        data: data,
        options: {
          responsive: true,
          scales: {
            x: {
              display: true,
              title: {
                display: true,
                text: x_title,
                color: '#911',
                font: {
                  family: 'Comic Sans MS',
                  size: 20,
                  weight: 'bold',
                  lineHeight: 1.2,
                },
                padding: {top: 20, left: 0, right: 0, bottom: 0}
              }
            },
            y: {
              display: true,
              title: {
                display: true,
                text: y_title,
                color: '#191',
                font: {
                  family: 'Comic Sans MS',
                  size: 20,
                  style: 'normal',
                  lineHeight: 1.2
                },
                padding: {top: 30, left: 0, right: 0, bottom: 0}
              }
            }
          }
        },
      };
      this.element = document.createElement("canvas")
      this.chart = new Chart(this.element, config);
    }

    getElement(){
        return this.element
    }

    add(value){
      this.x_list.push(this.x_list.length+1)
      this.y_list.push(value)
    }

    update(){
      this.chart.data.labels = this.x_list
      this.chart.data.datasets[0].data = this.y_list
      this.chart.update()
    }
}

// class Dual


