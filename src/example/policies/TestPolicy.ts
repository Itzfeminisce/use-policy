export default class TestPolicy {
  
  
    // This action will be rejected
  public delete_user(request: PolicyRequest){
    
    return request.user.id === 501
  }
  
  
  // This action will pass
  public test_policy(){
    
    return 1 === 1
  }
  
  
  
  // This action will also be rejected
  public test_policy_2(){
    
    return typeof 1 === typeof !true
  }
}