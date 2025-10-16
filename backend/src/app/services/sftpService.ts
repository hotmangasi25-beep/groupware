import { sftpRepository } from "../repositories/sftpRepository";

export const sftpService = {
    async testConnection(){
        console.log("[SERVICE] Testing connection to SFTP...");
        const result = await sftpRepository.connectSFTP();

        if(!result.success){
            throw new Error(result.error);
        }

        return result;
    }
}