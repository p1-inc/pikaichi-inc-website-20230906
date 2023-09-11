import { WorksDataType } from "../../data/worksData";
import { Savas01 } from "./savas01";
import { DefaultComponent } from "./defaultComponent";
import { Bathclin } from "./bathclin";

export const WorksComponent = ({ data }: { data: WorksDataType }) => {
	//
	if (data.id === "savas01") {
		return <Savas01 data={data} />;
	} else if (data.id === "bathclin") {
		return <Bathclin data={data} />;
	} else {
		return <DefaultComponent data={data} />;
	}
};
