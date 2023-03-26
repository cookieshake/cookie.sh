---
title: "kogpt를 이용해 간단한 Q&A 봇 만들기"
keywords: [gpt, kogpt, chatbot, 챗봇, Q&A, python, transformers]
tags: [gpt, kogpt, chatbot, 챗봇, Q&A, python, transformers]
last_update:
  date: 2023-03-27
  author: cookieshake
---

## 준비물

- 16GB 이상의 VRAM을 가진 GPU 혹은 32GB 이상의 RAM을 가진 PC
  - 테스트 PC 사양
    ``` sh
    ❯ ./sysfetch
    ingtranet@research
    kernel ~ 5.14.0-162.12.1.el9_1.0.2.x86_64
    arch ~ x86_64
    distro ~ Rocky Linux
    shell ~ bash
    cpu ~  12th Gen Intel Core i5-12500
    gpu ~ GA102 [GeForce RTX 3090] (rev a1)
    disk ~ 30G/127G 24% QEMU HARDDISK
    ram ~ 5457/23735M
    ```
- (GPU 사용의 경우) CUDA 설치 완료
  ``` sh
  ❯ nvidia-smi
  Sun Mar 26 14:57:44 2023
  +-----------------------------------------------------------------------------+
  | NVIDIA-SMI 525.85.12    Driver Version: 525.85.12    CUDA Version: 12.0     |
  |-------------------------------+----------------------+----------------------+
  | GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
  | Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
  |                               |                      |               MIG M. |
  |===============================+======================+======================|
  |   0  NVIDIA GeForce ...  Off  | 00000000:01:00.0 Off |                  N/A |
  |  0%   52C    P8    10W / 350W |  12428MiB / 24576MiB |      0%      Default |
  |                               |                      |                  N/A |
  +-------------------------------+----------------------+----------------------+
  ```
- torch 및 transformers 설치 완료
  ``` python title="requirements.txt"
  accelerate==0.18.0
  aiofiles==22.1.0
  aiosqlite==0.18.0
  anyio==3.6.2
  argon2-cffi==21.3.0
  argon2-cffi-bindings==21.2.0
  arrow==1.2.3
  asttokens==2.2.1
  attrs==22.2.0
  Babel==2.12.1
  backcall==0.2.0
  beautifulsoup4==4.12.0
  bleach==6.0.0
  certifi==2022.12.7
  cffi==1.15.1
  charset-normalizer==3.1.0
  cmake==3.26.1
  comm==0.1.3
  debugpy==1.6.6
  decorator==5.1.1
  defusedxml==0.7.1
  executing==1.2.0
  fastjsonschema==2.16.3
  filelock==3.10.6
  fqdn==1.5.1
  huggingface-hub==0.13.3
  idna==3.4
  ipykernel==6.22.0
  ipython==8.11.0
  ipython-genutils==0.2.0
  ipywidgets==8.0.5
  isoduration==20.11.0
  jedi==0.18.2
  Jinja2==3.1.2
  json5==0.9.11
  jsonpointer==2.3
  jsonschema==4.17.3
  jupyter-events==0.6.3
  jupyter-ydoc==0.2.3
  jupyter_client==8.1.0
  jupyter_core==5.3.0
  jupyter_server==2.5.0
  jupyter_server_fileid==0.8.0
  jupyter_server_terminals==0.4.4
  jupyter_server_ydoc==0.8.0
  jupyterlab==3.6.2
  jupyterlab-pygments==0.2.2
  jupyterlab-widgets==3.0.6
  jupyterlab_server==2.21.0
  lit==16.0.0
  MarkupSafe==2.1.2
  matplotlib-inline==0.1.6
  mistune==2.0.5
  mpmath==1.3.0
  nbclassic==0.5.3
  nbclient==0.7.2
  nbconvert==7.2.10
  nbformat==5.8.0
  nest-asyncio==1.5.6
  networkx==3.0
  notebook==6.5.3
  notebook_shim==0.2.2
  numpy==1.24.2
  nvidia-cublas-cu11==11.10.3.66
  nvidia-cuda-cupti-cu11==11.7.101
  nvidia-cuda-nvrtc-cu11==11.7.99
  nvidia-cuda-runtime-cu11==11.7.99
  nvidia-cudnn-cu11==8.5.0.96
  nvidia-cufft-cu11==10.9.0.58
  nvidia-curand-cu11==10.2.10.91
  nvidia-cusolver-cu11==11.4.0.1
  nvidia-cusparse-cu11==11.7.4.91
  nvidia-nccl-cu11==2.14.3
  nvidia-nvtx-cu11==11.7.91
  packaging==23.0
  pandas==1.5.3
  pandocfilters==1.5.0
  parso==0.8.3
  pexpect==4.8.0
  pickleshare==0.7.5
  Pillow==9.4.0
  platformdirs==3.2.0
  prometheus-client==0.16.0
  prompt-toolkit==3.0.38
  psutil==5.9.4
  ptyprocess==0.7.0
  pure-eval==0.2.2
  pycparser==2.21
  Pygments==2.14.0
  pyrsistent==0.19.3
  python-dateutil==2.8.2
  python-json-logger==2.0.7
  pytz==2023.2
  PyYAML==6.0
  pyzmq==25.0.2
  regex==2023.3.23
  requests==2.28.2
  rfc3339-validator==0.1.4
  rfc3986-validator==0.1.1
  Send2Trash==1.8.0
  six==1.16.0
  sniffio==1.3.0
  soupsieve==2.4
  stack-data==0.6.2
  sympy==1.11.1
  terminado==0.17.1
  tinycss2==1.2.1
  tokenizers==0.13.2
  tomli==2.0.1
  torch==2.0.0
  torchaudio==2.0.1
  torchvision==0.15.1
  tornado==6.2
  tqdm==4.65.0
  traitlets==5.9.0
  transformers==4.27.3
  triton==2.0.0
  typing_extensions==4.5.0
  uri-template==1.2.0
  urllib3==1.26.15
  wcwidth==0.2.6
  webcolors==1.12
  webencodings==0.5.1
  websocket-client==1.5.1
  widgetsnbextension==4.0.6
  y-py==0.5.9
  ypy-websocket==0.8.2
  ```

## 실행 코드

### 모델 불러들이기

``` python
import torch
from transformers import AutoTokenizer, GPTJForCausalLM 

tokenizer = AutoTokenizer.from_pretrained(
  'kakaobrain/kogpt', revision='KoGPT6B-ryan1.5b-float16',
  bos_token='[BOS]', eos_token='[EOS]', unk_token='[UNK]', pad_token='[PAD]', mask_token='[MASK]', add_bos_token = True
)
model = GPTJForCausalLM.from_pretrained(
  'kakaobrain/kogpt', revision='KoGPT6B-ryan1.5b-float16',
  pad_token_id=tokenizer.eos_token_id,
  torch_dtype=torch.float16, low_cpu_mem_usage=True
)
model.eval()
model.cuda() # GPU를 사용할 경우
```

### 간단한 질문 함수 작성

``` python
def ask(question):
    text = f'Q: {question} A:'
    with torch.no_grad():
        tokens = tokenizer.encode(text, return_tensors='pt').to(device='cuda', non_blocking=True)
        gen_tokens = model.generate(tokens, do_sample=False, temperature=0.1, max_length=128)
        generated = tokenizer.batch_decode(gen_tokens)[0]
        answer = generated.replace(text, '')
        answer = answer.split('Q:')[0].strip()
        answer = '. '.join(answer.split('. ')[:2])
        return answer
```

## 사용

1. 
  ``` python
  ask('대한민국의 인구는?')
  ```
  ```
  '약 5천만명'
  ```

2. 
  ``` python
  ask('아이유의 데뷔 날짜는?')
  ```
  ```
  '정확히는 모르겠지만, 아마 2008년 9월 쯤이었을 거예요.'
  ```

3. 
  ``` python
  ask('핵확산 금지조약이란?')
  ```
  ```
  '핵확산 금지조약은 핵무기의 개발, 생산, 보유, 사용 등을 금지하는 국제조약이다. 핵확산 금지조약은 핵무기의 확산을 막기 위해 미국, 소련, 영국, 프랑스, 중국 등 핵 보유 국가들의 핵무기 개발과 실험을 금지하는 내용을 담고 있다'
  ```

## 참고자료

- https://velog.io/@gtpgg1013/kogpt-한국어-생성-GPT-3-명문가-납시오
- https://huggingface.co/docs/transformers/main/en/model_doc/gptj
- https://github.com/kakaobrain/kogpt