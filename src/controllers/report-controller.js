import ReportService from "../services/report-service.js";

export default class ReportController {
    static async getPendapatan(request, response, nextFunction) {
        try {
            request.body.faskes_uuid = request.author.faskesUuid;
            const result = await ReportService.getPendapatan(request.body);
            response.status(200).json(result)
        } catch (error) {
            nextFunction(error);
        }
    }
}