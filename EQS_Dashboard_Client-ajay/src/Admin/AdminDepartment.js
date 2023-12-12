import React, { useEffect, useState } from 'react';
import { Button, message, Modal, Form, Input } from 'antd';
// import { MailOutlined, UserOutlined, UserAddOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import Sidebars from './AdminSidebar';
import apiList from '../lib/apiList';
import axios from 'axios';
import Cookies from 'js-cookie';


const Department = () => {
    const [showModal, setShowModal] = useState(false);
    const [form] = Form.useForm();

    const handleAddDepartment = async () => {
        try {
            const values = await form.validateFields();

            // Send a POST request to your API endpoint
            await axios.post(apiList.departments, values, {
                headers: {
                    Authorization: `Bearer ${Cookies.get('adminToken')}`,
                },
            });

            message.success('Department added successfully');
            setShowModal(false);
            form.resetFields();
        } catch (error) {
            console.error('Error adding department:', error);
            message.error('Error adding department. Please try again.');
        }
    };

    return (
        <div>
            <>
                <Sidebars />
                <div style={{ marginTop: "80px", marginLeft: "210px", height: '90vh', overflowY: "scroll" }} className='p-5'>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-md-3'>

                            </div>
                            <div className='col-md-6' >
                                <div className='card p-5 depart_card'  style={{boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px;'}}>
                                  <div className='text-center'><h2 style={{fontFamily: "sans-serif", marginBottom:"20px"}}>Add Department</h2></div>
                                    <Button type="primary"  onClick={() => setShowModal(true)} style={{backgroundColor:"#ff8135",padding:"5px 0px 30px"}}>
                                        Add Department
                                    </Button>
                                </div>
                            </div>
                            <div className='col-md-3'>

                            </div>
                        </div>

                    </div>


                    <Modal
                        title="Add Department"
                        visible={showModal}
                        onCancel={() => {
                            setShowModal(false);
                            form.resetFields();
                        }}
                        onOk={handleAddDepartment}
                    >
                        <Form form={form} layout="vertical">
                            <Form.Item
                                name="department"
                                label="Department"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter the department',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="designation"
                                label="Designation"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please enter the designation',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Form>
                    </Modal>
                </div>

            </>

        </div>
    );
}

export default Department