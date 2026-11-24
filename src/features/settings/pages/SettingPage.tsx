import { ArrowLeft } from "lucide-react";
import SingleButton from "../../../components/common/SingleButton";

export function SettingPage() {
  return (
    <div className="px-6 mt-15">
      <SingleButton
                direction="back"
                icon={<ArrowLeft size={23} />}
            />
    </div>
  );
}