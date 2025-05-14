class ApiResponse {
    constructor(statsusCode, data, messsage = "Success"){
        this.statsusCode = statsusCode;
        this.data = data;
        this.message = messsage;
        this.success = true;
    }
}