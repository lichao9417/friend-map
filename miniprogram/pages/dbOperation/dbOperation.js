// pages/dbOperation/dbOperation.js
const db = wx.cloud.database()
const f = db.collection('friend-map-data')
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },
    test: function() {
       f.where({
        
       }).update({
           data: {
            isMarkedOnMap: true,
            invisibleMode: false
           }
       }).then(res=>{
           console.log(res)
       })
    }    
})