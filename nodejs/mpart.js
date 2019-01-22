var M = {
  v:'v',
  f:function(){
    console.log(this.v);
  }
}


// M을 모듈 바깥에서 사용할 수 있게 하겠음
module.exports = M;
