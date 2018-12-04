const PatrolStepCode ={
    unReviewed: 0,//未审核,
    unSendOrder:1,//未派单,
    unClaim:2,//未认领,
    unChange:3,//未改派,
    unTelBooking:4,//未电话预约,
    unDepart:5,//未出发前往,
    unArrive:6,//未到达目的地,
    unCommitLivePatrolRecord:7,//未提交现场巡检记录
    unSignature:8,//客户未签字，也就是未确认,
    unSummary:9,//未事后总结
    unReturnVisit:10,//未服务回访,
    onStop:11,//已终止,
    onComplete:12,//已完成
}
export default PatrolStepCode;