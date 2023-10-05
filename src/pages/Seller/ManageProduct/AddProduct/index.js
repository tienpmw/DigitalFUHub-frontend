import React, { useEffect, useRef, useState, useContext } from 'react';
import { PlusOutlined, UploadOutlined, CloseOutlined } from '@ant-design/icons';
import { Button, Form, Input, Select, InputNumber, Upload, Modal, Table, Space, theme, Tag, Tooltip, Card } from 'antd';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Spinning from '~/components/Spinning';
import { NotificationContext } from '~/context/NotificationContext';
import maunhapsanpham from "~/assets/files/maunhapsanpham.xlsx"
import { getUserId, readDataFileExcelImportProduct } from '~/utils';
import { addProduct } from '~/api/seller';
import { getAllCategory } from '~/api/category';
import { useNavigate } from 'react-router-dom';

const columns = [
    {
        title: 'Số thứ tự',
        dataIndex: 'index',
        key: 'index',
        render: (text, record) => <div key={record.index}>{text}</div>,
    },
    {
        title: 'Dữ liệu sản phẩm',
        dataIndex: 'value',
        key: 'value',
        render: (text, record) => <div key={record.index}>{text}</div>,
    }
];


const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

function AddProduct() {
    const notification = useContext(NotificationContext);
    const [descriptionValue, setDescriptionValue] = useState('');
    const [thumbnailFile, setThumbnailFile] = useState([]);
    const [fileImgProdList, setFileImgProdList] = useState([]);
    const [previewDataFileExcel, setPreviewDataFileExcel] = useState([])
    const btnAddRef = useRef();
    const btnUploadRef = useRef();
    const [openModal, setOpenModel] = useState(false)
    const [excelFileList, setExcelFileList] = useState([]);
    const [tags, setTags] = useState([]);
    const [inputVisible, setInputVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef(null);
    const { token } = theme.useToken();
    const tagInputStyle = {
        width: 64,
        // height: 22,
        // marginInlineEnd: 8,
        // verticalAlign: 'top',
    };
    const tagPlusStyle = {
        // height: 22,
        background: token.colorBgContainer,
        borderStyle: 'dashed',
    };
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);

    const [previewImage, setPreviewImage] = useState('');
    const [previewImageTitle, setPreviewImageTitle] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);
    const navigate = useNavigate();

    const handlePreviewImage = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewImageTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const handleCancel = () => setPreviewOpen(false);

    // const dataFiles = useRef([]);


    // get list categories
    useEffect(() => {
        getAllCategory()
            .then((res) => {
                if (res.data.status.responseCode === "00") {
                    setCategories(res.data.result)
                }
            })
            .catch((err) => {

            })
    }, [])

    // handle upload thumbnail

    const handleThumbnailChange = (info) => {
        let newFileList = [...info.fileList];
        newFileList = newFileList.slice(-1);
        newFileList = newFileList.map((file) => {
            if (file.response) {
                file.url = file.response.url;
            }
            file.response = '';
            file.status = 'done';
            return file;
        });
        setThumbnailFile(newFileList);
    };

    // handle upload images product
    const handleImgProdChange = (info) => {
        let newFileList = [...info.fileList];
        newFileList = newFileList.slice(-5);
        newFileList = newFileList.map((file) => {
            if (file.response) {
                file.url = file.response.url;
            }
            file.response = '';
            file.status = 'done';
            return file;
        });
        setFileImgProdList(newFileList);
    };


    // add first box input product variants when visit page
    // useEffect(() => {
    //     btnAddRef.current.click();
    // }, [])

    // handle data file excel change
    const handleDataFileChange = (info) => {
        let newFileList = [...info.fileList];
        var mode = newFileList.length !== 0;
        let uidFile = info.file.uid;

        // delete file
        if (!mode) {
            let indexFileEqUid = -1;
            for (let index = 0; index < excelFileList.length; index++) {
                if (excelFileList[index] !== undefined && excelFileList[index].uid === uidFile) {
                    indexFileEqUid = index;
                    break;
                }
            }
            newFileList = [...excelFileList];
            newFileList[indexFileEqUid] = undefined;
            // newFileList.splice(indexFileEqUid, 1)
            setExcelFileList([...newFileList]);
        }
        // upload file
        else {
            newFileList = newFileList.slice(-1);
            newFileList = newFileList.map((file) => {
                if (file.response) {
                    file.url = file.response.url;
                }
                file.response = '';
                file.status = 'done';
                return file;
            });
            setExcelFileList(prev => {
                prev[btnUploadRef.current] = newFileList[0]
                return [...prev];
            });
        }
    }
    const handlePreviewDataFileExcel = (index) => {
        const file = excelFileList[index].originFileObj;
        readDataFileExcelImportProduct(file)
            .then(res => setPreviewDataFileExcel(res));
        setOpenModel(true);
    }

    // handle tags product

    useEffect(() => {
        if (inputVisible) {
            inputRef.current?.focus();
        }
    }, [inputVisible]);

    const handleClose = (removedTag) => {
        const newTags = tags.filter((tag) => tag !== removedTag);
        setTags(newTags);
    };
    const showInput = () => {
        setInputVisible(true);
    };
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };
    const handleInputConfirm = () => {
        if (inputValue.trim() && !tags.includes(inputValue)) {
            setTags([...tags, inputValue.trim()]);
        }
        setInputVisible(false);
        setInputValue('');
    };

    // submit form
    const onFinish = (values) => {
        setLoading(true);
        let formData = new FormData();
        values.productImages.fileList.forEach((file, index) => {
            formData.append(`images`, file.originFileObj);
        });
        values.productVariants.forEach((value, index) => {
            formData.append(`nameVariants`, value.typeProd);
            formData.append(`priceVariants`, value.priceProd);
            formData.append(`dataVariants`, excelFileList[index].originFileObj);

        });
        tags.forEach((value, index) => {
            formData.append(`tags`, value);
        });

        formData.append('productName', values.nameProduct);
        formData.append('userId', getUserId());
        formData.append('description', descriptionValue);
        formData.append('category', values.category);
        formData.append('discount', values.discount);
        formData.append('thumbnail', values.thumbnailProduct.file.originFileObj);
        addProduct(formData)
            .then((res) => {
                setLoading(false);
                if (res.data.status.responseCode === "00") {
                    notification('success', "Thêm sản phẩm mới thành công.");
                    // form.resetFields();
                    // setTags([]);
                    // setThumbnailFile([]);
                    // setFileImgProdList([]);
                    // setExcelFileList([]);
                    // btnAddRef.current.click();
                } else {
                    notification('error', "Thêm sản phẩm mới thất bại.");
                }
                return navigate('/seller/product/list')
            })
            .catch((err) => {
                setLoading(false);
                notification('error', "Đã có lỗi xảy ra.");
                return navigate('/seller/product/list')
            })
    }

    return (
        <>
            <Spinning spinning={loading}>
                <Card
                    onScroll={(e) => { console.log(e.y) }}
                    style={{
                        width: '100%',
                        minHeight: "690px",
                    }}
                    title="Thêm sản phẩm"
                >
                    <Modal open={previewOpen} title={previewImageTitle} footer={null} onCancel={handleCancel}>
                        <img
                            alt="thumbnail"
                            style={{
                                width: '100%',
                            }}
                            src={previewImage}
                        />
                    </Modal >
                    <Form
                        form={form}
                        layout="vertical"
                        style={{
                            maxWidth: '100%',
                            padding: '0 20%'
                        }}
                        onFinish={onFinish}
                    >
                        <div id='product-name'>
                            <Form.Item name='nameProduct' label="Tên sản phẩm:"
                                rules={[
                                    {
                                        required: true,
                                        message: "Tên sản phẩm không để trống."
                                    }
                                ]}
                            >
                                <Input placeholder='Tên sản phẩm' />
                            </Form.Item>
                        </div>
                        <div id='product-description'>
                            <Form.Item name='description' label="Mô tả:"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Mô tả sản phẩm không để trống.'
                                    }
                                ]}
                            >
                                <CKEditor
                                    editor={ClassicEditor}
                                    data=""
                                    config={{
                                        toolbar: ['heading', '|', 'bold', 'italic', '|', 'link', 'blockQuote', 'bulletedList', 'numberedList', 'outdent', 'indent', '|', 'undo', 'redo',]
                                    }}
                                    onReady={editor => {
                                    }}
                                    onChange={(event, editor) => {
                                        const data = editor.getData();
                                        // console.log({ event, editor, data });
                                        setDescriptionValue(data);
                                    }}
                                    onBlur={(event, editor) => {
                                        // console.log('Blur.', editor);
                                    }}
                                    onFocus={(event, editor) => {
                                        // console.log('Focus.', editor);
                                    }}
                                />
                            </Form.Item>
                        </div>
                        <div id='product-thumbnail'>
                            <Form.Item name='thumbnailProduct' label='Ảnh đại diện sản phẩm:'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Ảnh đại diện sản phẩm không để trống.'
                                    }
                                ]}
                            >
                                <Upload
                                    beforeUpload={false}
                                    listType="picture-card"
                                    fileList={thumbnailFile}
                                    onPreview={handlePreviewImage}
                                    onChange={handleThumbnailChange}
                                    maxCount={1}
                                    accept=".png, .jpeg, .jpg"
                                >
                                    {thumbnailFile.length < 1 ? <div>
                                        <PlusOutlined />
                                        <div
                                            style={{
                                                marginTop: 8,
                                            }}
                                        >
                                            Tải lên
                                        </div>
                                    </div> : null}
                                </Upload>
                            </Form.Item>
                        </div>
                        <div id='product-images'>
                            <Form.Item name='productImages' label='Ảnh chi tiết sản phẩm (tối đa 5 ảnh):'
                                rules={[
                                    {
                                        required: true,
                                        message: 'Ảnh chi tiết sản phẩm không để trống.'
                                    }
                                ]}
                            >
                                <Upload
                                    beforeUpload={false}
                                    listType="picture-card"
                                    fileList={fileImgProdList}
                                    onPreview={handlePreviewImage}
                                    onChange={handleImgProdChange}
                                    multiple={true}
                                    maxCount={5}
                                    accept=".png, .jpeg, .jpg"
                                >
                                    {fileImgProdList.length < 5 ? <div>
                                        <PlusOutlined />
                                        <div
                                            style={{
                                                marginTop: 8,
                                            }}
                                        >
                                            Tải lên
                                        </div>
                                    </div> : null}
                                </Upload>
                            </Form.Item>
                        </div>
                        <div id='product-discount'>
                            <Form.Item name='discount' label="Giảm giá:"
                                rules={
                                    [{
                                        required: true,
                                        message: 'Giảm giá sản phẩm không để trống.'
                                    }]}
                            >
                                <InputNumber style={{ width: '100%' }} placeholder='giảm giá' addonAfter="%" min={0} max={100} />
                            </Form.Item>
                        </div>
                        <div id='product-category'>
                            <Form.Item name='category' label="Danh mục:"
                                rules={
                                    [{
                                        required: true,
                                        message: 'Danh mục sản phẩm không để trống.'
                                    }]}
                            >
                                <Select placeholder="Danh mục" allowClear>
                                    {categories.map((value, index) =>
                                        <Select.Option key={index} value={value.categoryId}>{value.categoryName}</Select.Option>
                                    )}
                                </Select>
                            </Form.Item>
                        </div>
                        <div id='product-variants'>
                            <Form.List name="productVariants"
                                initialValue={[{
                                    typeProd: '',
                                    priceProd: ''
                                }]}
                            >
                                {(fields, { add, remove }) => (
                                    <>
                                        <Space direction='horizontal'>
                                            <Form.Item label={<div>Loại sản phẩm: (<a href={maunhapsanpham} download>Tải mẫu nhập sản phẩm</a>)</div>} style={{ marginBottom: -30 }}
                                                required={true}
                                            />
                                        </Space>
                                        {fields.map(({ key, name, ...restField }) => (

                                            <Space
                                                key={key}
                                                style={{
                                                    // display: 'flex',
                                                    display: 'block',
                                                    marginBottom: 8,
                                                }}
                                                align="baseline"
                                            >
                                                <Card style={{ width: '100%' }}
                                                    title={`Phân loại ${name + 1}`}
                                                    extra={fields.length > 1 ? (
                                                        <CloseOutlined onClick={() => {
                                                            remove(name)
                                                            // delete file in array
                                                            let newDataFile = excelFileList;
                                                            newDataFile.splice(name, 1)
                                                            setExcelFileList(newDataFile)
                                                        }} />
                                                    ) : null}
                                                >
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'typeProd']}
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: 'Loại sản phẩm không để trống.',
                                                            },
                                                        ]}
                                                    >
                                                        <Input placeholder="Tên loại sản phẩm" />
                                                    </Form.Item>
                                                    <Form.Item
                                                        {...restField}
                                                        name={[name, 'priceProd']}
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: 'Giá loại sản phẩm không để trống',
                                                            },
                                                        ]}
                                                    >
                                                        <InputNumber style={{ width: '100%' }} min={0} addonAfter="VNĐ" placeholder="Giá loại sản phẩm" />
                                                    </Form.Item>
                                                    <Form.Item
                                                        {...restField}
                                                        required={true}
                                                        name={[name, 'dataFile']}
                                                        validateTrigger={["onBlur", "onFocus", "onInput", "onChange", "onMouseEnter", "onMouseLeave", "onMouseOver"]}
                                                        rules={[
                                                            (getFieldValue) => ({
                                                                validator(_, value) {
                                                                    if (excelFileList[name] !== undefined) {
                                                                        return Promise.resolve();
                                                                    }
                                                                    return Promise.reject(new Error('Vui lòng tải dữ liệu.'));
                                                                },
                                                            }),
                                                        ]}
                                                    >
                                                        <Space direction='horizontal' align='start'>
                                                            <Upload
                                                                beforeUpload={false}
                                                                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                                                onChange={handleDataFileChange}
                                                                fileList={excelFileList[name] ? [excelFileList[name]] : []}>
                                                                {excelFileList[name] === undefined && <Button onClick={() => btnUploadRef.current = name} icon={<UploadOutlined />}>Tải lên</Button>}
                                                            </Upload>
                                                            {excelFileList[name] !== undefined &&
                                                                <Button type='primary' onClick={(e) => {
                                                                    handlePreviewDataFileExcel(name);
                                                                    e.preventDefault();
                                                                }}>Xem trước dữ liệu</Button>
                                                            }

                                                        </Space>

                                                    </Form.Item>
                                                </Card>
                                            </Space>
                                        ))}
                                        <Modal style={{
                                            height: '200px'
                                        }} open={openModal} title='Xem trước dữ liệu' footer={null} onCancel={() => setOpenModel(false)}>
                                            <Table
                                                rowKey={(record) => record.index}
                                                scroll={{
                                                    y: 200,
                                                }} columns={columns} dataSource={previewDataFileExcel} />
                                        </Modal >
                                        <Form.Item>
                                            <Button ref={btnAddRef} type="dashed" onClick={() => {
                                                add();
                                                setExcelFileList(prev => [...prev, undefined])
                                            }} block icon={<PlusOutlined />}>
                                                Thêm
                                            </Button>
                                        </Form.Item>

                                    </>
                                )}
                            </Form.List>
                        </div>
                        <div id='product-tags'>
                            <Form.Item name='tagsProduct' label="Nhãn:" required={true}

                                validateTrigger={["onBlur", "onChange", "onFocus", "onMouseEnter", "onMouseLeave", "onKeyDown"]}
                                rules={
                                    [
                                        (getFieldValue) => ({
                                            validator(_, value) {
                                                if (tags.length > 0) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject(new Error('Vui lòng nhập ít nhất 1 nhãn.'));
                                            },
                                        }),
                                    ]}
                            >
                                {/* <AddTagProduct handleTagsChange={handleTagsChange} /> */}
                                < Space size={[0, 8]} wrap >
                                    {
                                        tags.map((tag, index) => {
                                            const isLongTag = tag.length > 20;
                                            const tagElem = (
                                                <Tag
                                                    key={tag}
                                                    color="#87d068"
                                                    closable={index !== -1}
                                                    style={{
                                                        userSelect: 'none',
                                                        padding: '6px', fontSize: '16px'
                                                    }}
                                                    onClose={() => handleClose(tag)}
                                                >
                                                    <span
                                                    >
                                                        {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                                                    </span>
                                                </Tag>
                                            );
                                            return isLongTag ? (
                                                <Tooltip title={tag} key={tag}>
                                                    {tagElem}
                                                </Tooltip>
                                            ) : (
                                                tagElem
                                            );
                                        })
                                    }
                                    {
                                        inputVisible ? (
                                            <Input
                                                ref={inputRef}
                                                type="text"
                                                size="medium"
                                                style={{ ...tagInputStyle, fontSize: '16px', padding: '6px' }}
                                                value={inputValue}
                                                onChange={handleInputChange}
                                                onBlur={handleInputConfirm}
                                                onPressEnter={handleInputConfirm}
                                            />
                                        ) : (
                                            <Tag style={{ ...tagPlusStyle, padding: '6px', fontSize: '16px' }} icon={<PlusOutlined />} onClick={showInput}>
                                                Thêm nhãn
                                            </Tag>
                                        )}
                                </Space>
                            </Form.Item>
                        </div>
                        <div id='button'>
                            <Form.Item style={{ textAlign: 'center' }}>
                                <Button type='primary' size='large' htmlType='submit'>Xác nhận</Button>
                            </Form.Item>
                        </div>
                    </Form >
                </Card>
            </Spinning >
        </>
    );
};
export default AddProduct;