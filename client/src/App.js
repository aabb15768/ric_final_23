import React, { Component } from 'react'
import { Card, CardHeader} from 'reactstrap'

var getDataInterval = 100000;

class App extends Component {
  state = {
    data: [],
    id: 0,
    message: null,
    intervalIsSet: false,
    isOpen: {},
  };

  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }

  componentDidMount() {
    this.getDataFromDb();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, getDataInterval);
      this.setState({ intervalIsSet: interval });
    }
  }
  getDataFromDb = () => {
    fetch('https://fathomless-beyond-18550.herokuapp.com/api/getData')
      .then((data) => data.json())
      .then((res) => {
        if(res !== this.state.data) {
          res.sort(function(first, second) {
            return second["_id"] - first["_id"];
          });          
          this.setState({ data: res});
          res.map((data) => {
            this.state.isOpen[data["_id"]] = false;
          });
        }
      });
  };

  computeDate = (time) => {
    var output = "";
    var year = time / 100000000;
    var month = time % 100000000 / 1000000;
    var day = time % 1000000 / 10000;
    var hour= time % 10000 / 100;
    var minute = time % 100;
    if(parseInt(minute) < 10 && parseInt(hour) < 10) {
      output = parseInt(year) + "年" + parseInt(month) + "月" + parseInt(day) + "日" + "0" + parseInt(hour) + ":0" + parseInt(minute); 
    } else if(parseInt(minute) < 10) {
      output = parseInt(year) + "年" + parseInt(month) + "月" + parseInt(day) + "日" + parseInt(hour) + ":0" + parseInt(minute); 
    } else if(parseInt(hour) < 10) {
      output = parseInt(year) + "年" + parseInt(month) + "月" + parseInt(day) + "日" + "0" + parseInt(hour) + ":" + parseInt(minute) ; 
    } else {
      output = parseInt(year) + "年" + parseInt(month) + "月" + parseInt(day) + "日" + parseInt(hour) + ":" + parseInt(minute) ; 
    }
    return output;
  }

  openOnclick = (event) => {
    if(this.state.isOpen[event.target.id] == false) {
      var selectPost = "card"+event.target.id;
      event.target.innerHTML = "close";
      document.getElementById(selectPost).style.display = 'block';
      this.state.isOpen[event.target.id] = true;
    } else {
      var selectPost = "card"+event.target.id;
      event.target.innerHTML = "open";
      document.getElementById(selectPost).style.display = 'none';
      this.state.isOpen[event.target.id] = false;
    }
  }

  computeImage = (data) => {
    var string1 = `data:image/png;base64,${data["fig_one_post"]}`;
    var string2 = `data:image/png;base64,${data["fig_two_post"]}`;
    var string3 = `data:image/png;base64,${data["fig_three_post"]}`;
    var string4 = `data:image/png;base64,${data["fig_four_post"]}`;
    return(
      <React.Fragment>
        <div className="info-title justify-content-center">全台原雷達回波圖(dBZ)</div>
        <CardHeader><img src={string1}/></CardHeader>
        <div className="info-title justify-content-center">全台原雷達迴波圖(um^3)</div>
        <CardHeader><img src={string2}/></CardHeader>
        <div className="info-title justify-content-center">全台雨帶預測降雨量(mm/hr)(線性模型)(對上空所有的雲(回波)都做分析轉換，結果如是一片黑，表示模型顯示台灣上空無會降雨的雲)</div>
        <CardHeader><img src={string3}/></CardHeader>
        <div className="info-title justify-content-center">全台雨帶預測降雨量(mm/hr)(機器學習模型)(只對圖上方框內的雲(回波)做分析轉換)</div>
        <CardHeader><img src={string4}/></CardHeader>
      </React.Fragment>
    );
  }

  render() {
    return (
      <div className="container m-5">
        <div className="row d-flex justify-content-center big-header">
          <h1>國立臺灣大學降雨預測(ric_final)</h1>
        </div>
        <div className="row d-flex justify-content-center big-header">
          <h1>使用方法：線性統計與機器學習</h1>
        </div>
        <hr/>
        <div className="row d-flex justify-content-center">
          <div className="container row-right">
            <h1 align="center">氣象資訊</h1>
            <hr/>
              {
                this.state.data.map((data, num) => (
                  <div key={num}>
                    <div className="row self-row">
                      <div className="col-md-8">
                        {this.computeDate(data["_id"])}
                      </div>
                      <div className="col-md-4 float-right">
                        <button id={data["_id"]} className="btn float-right" onClick={(e) => this.openOnclick(e)}>open</button>
                      </div>
                    </div>
                    <div id={`card${data["_id"]}`} style={{display: 'none' }}>
                      <Card className="posts" style={{ margin: '1%', width: '100%' }}>
                        <div className="info-title justify-content-center">氣象局資訊</div>
                        <CardHeader>{`溫度：${data["temperature"]} °C`}</CardHeader>
                        <CardHeader>{`濕度：${data["humidity"]} %`}</CardHeader>
                        <CardHeader>{`降雨機率：${data["cwb_forecast"]} %`}</CardHeader>
                        {this.computeImage(data)}
                        <div className="info-title justify-content-center">地面預測資訊</div>
                        <CardHeader>{`風向：${data["wind_direction"]}`}</CardHeader>
                        <CardHeader>{`風速：${data["wind_speed"]}m/s`}</CardHeader>
                        <CardHeader>{`降雨量（線性）：${data["my_ground_predict_with_old_zr"].toFixed(2)}mm/hr`}</CardHeader>
                        <CardHeader>{`降雨量（機器學習）：${data["my_ground_predict_with_new_zr"].toFixed(2)}mm/hr`}</CardHeader>
                        <div className="info-title justify-content-center">高度500hPa</div>
                        <CardHeader>{`風向：${data["wind_direction_500"]}`}</CardHeader>
                        <CardHeader>{`風速：${data["wind_speed_500"]}m/s`}</CardHeader>
                        <CardHeader>{`降雨量（線性）：${data["my_500_predict_with_old_zr"].toFixed(2)}mm/hr`}</CardHeader>
                        <CardHeader>{`降雨量（機器學習）：${data["my_500_predict_with_new_zr"].toFixed(2)}mm/hr`}</CardHeader>
                        <div className="info-title justify-content-center">高度850hPa</div>
                        <CardHeader>{`風向：${data["wind_direction_850"]}`}</CardHeader>
                        <CardHeader>{`風速：${data["wind_speed_850"]}m/s`}</CardHeader>
                        <CardHeader>{`降雨量（線性）：${data["my_850_predict_with_old_zr"].toFixed(2)}mm/hr`}</CardHeader>
                        <CardHeader>{`降雨量（機器學習）：${data["my_850_predict_with_new_zr"].toFixed(2)}mm/hr`}</CardHeader>
                      </Card>
                    </div>
                  </div>
                ))
              }
          </div>
      </div>
    </div>
    )
  }
}
export default App