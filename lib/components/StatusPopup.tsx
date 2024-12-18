"use client";

import React from 'react';
import { Modal, Spin } from 'antd';
import { create } from 'zustand';
import { useShallow } from 'zustand/shallow';
import Image from 'next/image';
import { Loading3QuartersOutlined } from '@ant-design/icons';
export const AVAILABLE_STATUS: {
  LOADING: "loading";
  SUCCESS: "success";
  ERROR: "error";
} = {
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
}
export interface StatusPopupStateInterface {
  isVisible: boolean;
  status: "loading" | "success" | "error";
  message: string;
  setData: (newState: Partial<StatusPopupStateInterface>) => void;
}

export const StatusPopupState = create<StatusPopupStateInterface>((set) => ({
  isVisible: false,
  status: "loading",
  message: "",
  setData: (newState: Partial<StatusPopupStateInterface>) => set((oldState: StatusPopupStateInterface) => {
    const state = {
      ...oldState,
      ...newState
    }
    return {
      ...state
    }
  }),
}));
export const StatusPopup = () => {
  const { isVisible, status, message, setData } = StatusPopupState(useShallow((s) => ({
    isVisible: s.isVisible,
    status: s.status,
    message: s.message,
    setData: s.setData
  })));

  // Function to handle modal close
  const handleClose = () => {
    setData({ isVisible: false }); // Close the modal
  };

  return (
    <div>
      <Modal
        visible={isVisible}
        footer={null}
        onCancel={handleClose}
        maskClosable={false}
        style={{
          height: 'auto',
          maxHeight: '100vh',
          maxWidth: '50%',
          marginTop: '20vh',
        }}
        bodyStyle={{
          height: 'auto',
          paddingTop: '5%',
          paddingBottom: '5%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        wrapClassName="status-modal"
        closable={status === AVAILABLE_STATUS.SUCCESS || status === AVAILABLE_STATUS.ERROR}
      >
        {status === AVAILABLE_STATUS.LOADING && <div style={{ textAlign: 'center' }}>
          <Spin indicator={<Loading3QuartersOutlined spin />} tip="Loading..." size="large" />
          <p>{message}</p>
        </div>
        }
        {
          status === AVAILABLE_STATUS.SUCCESS && <div style={{ textAlign: 'center' }}>
            <Image src="/success.svg" alt="success" width={100} height={100} />
            <p>{message}</p>
            <button onClick={handleClose}>Close</button>
          </div>
        }
        {
          status === AVAILABLE_STATUS.ERROR && <div style={{ textAlign: 'center' }}>
            <Image src="/error.svg" alt="error" width={100} height={100} />
            <p>{message}</p>
            <button onClick={handleClose}>Close</button>
          </div>
        }
      </Modal>
    </div>
  );
};
