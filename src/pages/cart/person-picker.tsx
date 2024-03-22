import { ListItem } from "components/list-item";
import React, { FC, useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { phoneState, requestPhoneTriesState, userState } from "state";
import { useSnackbar } from "zmp-ui";

export const PersonPicker: FC = () => {
  const user = useRecoilValue(userState);
  const phone = useRecoilValue(phoneState);
  const snackbar = useSnackbar();

  useEffect(() => {
    if (phone && phone.error) {
      snackbar.openSnackbar({ type: "error", text: phone.error || "Không thể truy cập số điện thoại" });
    }
  }, [phone]);

  if (!phone) {
    return <RequestPersonPickerPhone />;
  }

  if (phone && phone?.error) {
    return <ListItem title={"Không thể truy cập số điện thoại"} subtitle="Người nhận" />;
  }

  return <ListItem title={`${user.name} - ${phone.phone}`} subtitle="Người nhận" />;
};

export const RequestPersonPickerPhone: FC = () => {
  const retry = useSetRecoilState(requestPhoneTriesState);
  return (
    <ListItem
      onClick={() => retry((r) => r + 1)}
      title="Chọn người nhận"
      subtitle="Yêu cầu truy cập số điện thoại"
    />
  );
};
