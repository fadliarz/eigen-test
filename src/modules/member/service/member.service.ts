import {inject, injectable} from "inversify";
import {IMemberRepository, IMemberService} from "../member.interface";
import {MemberDITypes, MemberModel} from "../member.type";

@injectable()
export default class MemberService implements IMemberService {
    @inject(MemberDITypes.REPOSITORY)
    private readonly repository: IMemberRepository;

    public async getMembers(): Promise<MemberModel[]> {
        try {
            return await this.repository.getMembers()
        } catch (error) {
            throw error
        }
    }
}