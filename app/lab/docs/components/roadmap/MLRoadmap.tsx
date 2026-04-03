"use client";

import React, { useState } from "react";
import {
  RoadmapTrackBox,
  RoadmapFilterGrid,
  RoadmapPathStrip,
  RoadmapSectionHeader,
  RoadmapCard,
  RoadmapProjectGrid,
  RoadmapProjectCard,
} from "./RoadmapComponents";

export default function MLRoadmap() {
  const [filter, setFilter] = useState("all");

  const isVisible = (track: string) => filter === "all" || track.includes(filter);

  return (
    <div className="w-full max-w-4xl mx-auto py-2">
      <RoadmapPathStrip>
        <strong className="text-foreground font-semibold">How to use this guide:</strong> Filter by track below, or scroll all sections. Each resource shows difficulty, what you'll build, and why it matters in production.
      </RoadmapPathStrip>

      <RoadmapFilterGrid>
        <RoadmapTrackBox id="all" label="All" sub="Full roadmap" active={filter === "all"} onClick={setFilter} />
        <RoadmapTrackBox id="ml" label="ML Foundations" sub="Stats, sklearn" active={filter === "ml"} onClick={setFilter} />
        <RoadmapTrackBox id="dl" label="Deep Learning" sub="PyTorch, theory" active={filter === "dl"} onClick={setFilter} />
        <RoadmapTrackBox id="llm" label="LLMs & GenAI" sub="Transformers, RAG" active={filter === "llm"} onClick={setFilter} />
        <RoadmapTrackBox id="agents" label="AI Agents" sub="Multi-agent systems" active={filter === "agents"} onClick={setFilter} />
        <RoadmapTrackBox id="mlops" label="MLOps / LLMOps" sub="Deploy, monitor" active={filter === "mlops"} onClick={setFilter} />
      </RoadmapFilterGrid>

      <div className="mt-6 flex flex-col gap-1">
        {isVisible("ml dl") && <RoadmapSectionHeader title="Phase 1 — ML & Deep Learning Foundations" />}

        {isVisible("ml") && (
          <>
            <RoadmapCard
              tags={["scikit-learn", "NumPy", "TensorFlow intro"]}
              badges={["Beginner"]}
              title="Andrew Ng — Machine Learning Specialization"
              url="https://www.coursera.org/specializations/machine-learning-introduction"
              meta="Coursera · DeepLearning.AI · 3 courses"
              description="The single best entry point into ML. Covers supervised & unsupervised learning, neural nets, and decision trees with clean math intuition."
              learn="You'll learn: linear/logistic regression, gradient descent, SVMs, clustering, anomaly detection, recommender systems."
            />
            <RoadmapCard
              tags={["scikit-learn", "pandas", "matplotlib"]}
              badges={["Beginner"]}
              title="Microsoft ML for Beginners"
              url="https://github.com/microsoft/ML-For-Beginners"
              meta="GitHub · ~68k stars · 12-week structured curriculum"
              description="26 lessons covering classical ML with real datasets. Every lesson includes Jupyter notebooks, quizzes, and assignments — structured like a university course but free."
              learn="You'll learn: regression, classification, clustering, NLP basics, time-series — all via scikit-learn."
            />
            <RoadmapCard
              tags={["scikit-learn", "TensorFlow", "Keras"]}
              badges={["Intermediate", "Hidden gem"]}
              title="Hands-On Machine Learning (3rd ed.) — Aurélien Géron"
              url="https://github.com/ageron/handson-ml3"
              meta="GitHub · ~28k stars · Companion to the O'Reilly book"
              description="The most practical ML book available. Goes deep on sklearn internals, Keras, TensorFlow, then all the way to transformers and diffusion models. Industry engineers reference this constantly."
              learn="You'll learn: end-to-end ML pipelines, dimensionality reduction, ensemble methods, CNNs, RNNs, attention, deployment."
            />
            <RoadmapCard
              tags={["NumPy", "Math-first", "From scratch"]}
              badges={["Intermediate", "Hidden gem"]}
              title="Homemade Machine Learning"
              url="https://github.com/trekhleb/homemade-machine-learning"
              meta="GitHub · ~22k stars · Pure NumPy implementations"
              description="Every major ML algorithm implemented from scratch with math derivations and interactive Jupyter demos. If you want to truly understand how models work, rebuild them by hand here."
              learn="You'll learn: the math behind gradient descent, SVMs, k-means, PCA, anomaly detection — without any magic library abstractions."
            />
          </>
        )}

        {isVisible("dl") && (
          <>
            <RoadmapCard
              tags={["PyTorch", "fastai", "Hugging Face"]}
              badges={["Intermediate"]}
              title="fast.ai — Practical Deep Learning for Coders"
              url="https://course.fast.ai/"
              meta="fast.ai · Jeremy Howard · Free"
              description="Top-down learning: you build and ship a model in lesson 1, then peel back the layers. Legendary for producing practitioners fast. Used by thousands of industry engineers."
              learn="You'll learn: CNNs, NLP, tabular models, diffusion, model deployment — all in PyTorch."
            />
            <RoadmapCard
              tags={["PyTorch", "Transformers", "From scratch"]}
              badges={["Intermediate"]}
              title="Andrej Karpathy — Neural Networks: Zero to Hero"
              url="https://github.com/karpathy/nn-zero-to-hero"
              meta="GitHub · ~35k stars · YouTube lecture series"
              description="The best deep learning course that exists. Karpathy builds everything from a scalar autograd engine → MLP → CNN → GPT from scratch in live code. No hand-waving, no magic — just pure intuition."
              learn="You'll learn: backprop, batch norm, attention, transformers, tokenization, GPT — all implemented from scratch in PyTorch."
            />
            <RoadmapCard
              tags={["PyTorch", "TensorFlow", "Theory + code"]}
              badges={["Intermediate"]}
              title="Dive into Deep Learning (d2l.ai)"
              url="https://d2l.ai/"
              meta="GitHub · ~24k stars · Berkeley textbook, interactive"
              description="Open-source interactive textbook used at 500+ universities. Math + code in one place, every concept runnable in-browser. The reference text for understanding DL theory with implementation."
              learn="You'll learn: linear algebra for DL, CNNs, RNNs, attention, transformers, optimization, generative models."
            />
            <RoadmapCard
              tags={["TensorFlow", "Academic rigor", "Free"]}
              badges={["Intermediate"]}
              title="MIT 6.S191 — Introduction to Deep Learning"
              url="http://introtodeeplearning.com/"
              meta="MIT · Free · Updated annually"
              description="MIT's official deep learning course. Runs every January with updated content — covers RL, diffusion, multimodal models, and applied labs. Concise and technically rigorous."
              learn="You'll learn: CNNs, RNNs, transformers, RL, generative models, responsible AI — in hands-on TensorFlow labs."
            />
            <RoadmapCard
              tags={["TensorFlow", "Keras", "Structured projects"]}
              badges={["Advanced", "Hidden gem"]}
              title="Deep Learning Specialization — Andrew Ng"
              url="https://github.com/deeplearning-ai/machine-learning-specialization-coursera"
              meta="Coursera · deeplearning.ai · 5 courses"
              description="Goes deeper than the ML Specialization — full treatment of CNNs, sequence models, hyperparameter tuning, and structuring ML projects. Industry standard for structured DL education."
              learn="You'll learn: hyperparameter tuning, batch norm, optimization algorithms, object detection, NLP with attention."
            />
          </>
        )}

        {isVisible("llm") && <RoadmapSectionHeader title="Phase 2 — Transformers, LLMs & Generative AI" />}

        {isVisible("llm") && (
          <>
            <RoadmapCard
              tags={["Transformers", "Datasets", "PEFT/LoRA"]}
              badges={["Intermediate"]}
              title="Hugging Face NLP Course"
              url="https://huggingface.co/learn/nlp-course/chapter1/1"
              meta="huggingface.co · Free · Official"
              description="The definitive course for working with transformers in production. Written by the people who built the library. Covers fine-tuning, tokenization, datasets, and evaluation end-to-end."
              learn="You'll learn: BERT, GPT, T5, fine-tuning with Trainer API, RLHF concepts, model sharing, inference optimization."
            />
            <RoadmapCard
              tags={["OpenAI API", "LangChain", "RAG"]}
              badges={["Intermediate"]}
              title="Microsoft — Generative AI for Beginners"
              url="https://github.com/microsoft/generative-ai-for-beginners"
              meta="GitHub · ~80k stars · 21-lesson course"
              description="Structured 21-lesson course by Microsoft Cloud Advocates covering prompt engineering, RAG, agents, fine-tuning, and deployment in Python and TypeScript. One of the most complete GenAI curricula freely available."
              learn="You'll learn: prompt design, embeddings, RAG pipelines, agent frameworks, responsible AI, Azure & OpenAI API usage."
            />
            <RoadmapCard
              tags={["LoRA/QLoRA", "vLLM", "Quantization"]}
              badges={["Intermediate"]}
              title="LLM Course — Maxime Labonne"
              url="https://github.com/mlabonne/llm-course"
              meta="GitHub · ~47k stars · Comprehensive LLM map"
              description="A dense, well-structured roadmap covering the entire LLM landscape: fundamentals, architecture, training, fine-tuning (LoRA, QLoRA), RLHF, quantization, and deployment. Think of it as an LLM engineer's operating manual."
              learn="You'll learn: tokenization, attention, RLHF, DPO, LoRA, quantization (GGUF, GPTQ), vLLM serving, LangChain."
            />
            <RoadmapCard
              tags={["TRL", "PEFT", "SFT/DPO"]}
              badges={["Advanced"]}
              title="Hugging Face Smol Course"
              url="https://github.com/huggingface/smol-course"
              meta="GitHub · ~5k stars · Practical fine-tuning on small models"
              description="Hands-on course focused on fine-tuning small LLMs (SmolLM, Qwen, Llama) — SFT, preference alignment, synthetic data generation, and vision-language models. The most practical fine-tuning resource available."
              learn="You'll learn: SFT with TRL, DPO, ORPO, synthetic data with distilabel, multimodal fine-tuning."
            />
            <RoadmapCard
              tags={["LlamaIndex", "LangChain", "FAISS/Chroma"]}
              badges={["Intermediate"]}
              title="RAG Techniques — Nir Diamant"
              url="https://github.com/NirDiamant/RAG_Techniques"
              meta="GitHub · ~12k stars · 30+ RAG patterns"
              description="The most complete RAG implementation reference. Covers 30+ advanced patterns: HyDE, GraphRAG, hybrid search, reranking, RAPTOR, corrective RAG. Every technique has runnable notebooks and benchmark comparisons."
              learn="You'll learn: chunking strategies, embedding models, vector stores, reranking, agentic RAG, performance benchmarking."
            />
            <RoadmapCard
              tags={["PyTorch", "LLM internals", "From scratch"]}
              badges={["Advanced", "Hidden gem"]}
              title="Build an LLM From Scratch — Sebastian Raschka"
              url="https://github.com/rasbt/LLMs-from-scratch"
              meta="GitHub · ~40k stars · Companion to the O'Reilly book"
              description="Chapter-by-chapter implementation of a GPT-style LLM from scratch: tokenization, attention, pretraining, instruction fine-tuning, RLHF. One of the most thorough technical resources on LLM internals."
              learn="You'll learn: BPE tokenization, multi-head attention, pretraining loop, LoRA, instruction tuning, RLHF from scratch."
            />
            <RoadmapCard
              tags={["Production RAG", "Docker", "Enterprise"]}
              badges={["Advanced", "Hidden gem"]}
              title="RAGFlow"
              url="https://github.com/infiniflow/ragflow"
              meta="GitHub · ~70k stars · Production RAG engine"
              description="Production-grade RAG engine used in enterprise AI systems. Deep document understanding, configurable LLMs, multi-recall with re-ranking, and agent tooling. Study the architecture — it shows how real RAG systems are actually built."
              learn="You'll learn: document parsing pipelines, vector indexing, agentic retrieval, production-scale RAG architecture."
            />
          </>
        )}

        {isVisible("agents") && <RoadmapSectionHeader title="Phase 3 — AI Agents & Multi-Agent Systems" />}

        {isVisible("agents") && (
          <>
            <RoadmapCard
              tags={["AutoGen", "Semantic Kernel", "Tool use"]}
              badges={["Intermediate"]}
              title="Microsoft — AI Agents for Beginners"
              url="https://github.com/microsoft/ai-agents-for-beginners"
              meta="GitHub · ~15k stars · Structured 10-lesson course"
              description="Structured beginner-to-intermediate course covering agentic loops, tool use, planning, memory, and multi-agent patterns. Covers both theory and hands-on builds with real frameworks."
              learn="You'll learn: ReAct, tool calling, memory systems, multi-agent orchestration, Semantic Kernel, AutoGen."
            />
            <RoadmapCard
              tags={["Agents", "RAG", "LangSmith"]}
              badges={["Intermediate"]}
              title="LangChain"
              url="https://github.com/langchain-ai/langchain"
              meta="GitHub · ~100k stars · Standard LLM application framework"
              description="The most widely used framework for building LLM-powered apps. Chains, agents, tools, memory — all composable. Massive ecosystem. Used in production by thousands of companies. Essential to know even if you later move to alternatives."
              learn="You'll learn: chains, LCEL, agents with tools, memory, structured output, LangSmith tracing."
            />
            <RoadmapCard
              tags={["RAG", "Data connectors", "Agents"]}
              badges={["Intermediate"]}
              title="LlamaIndex"
              url="https://github.com/run-llama/llama_index"
              meta="GitHub · ~40k stars · Data framework for LLMs"
              description="The leading framework for connecting LLMs to your data. More opinionated than LangChain for RAG use cases — better abstractions for indexing, retrieval, and agentic workflows over documents."
              learn="You'll learn: document ingestion, index construction, query engines, agentic RAG, multi-modal pipelines."
            />
            <RoadmapCard
              tags={["Multi-agent", "Code agents", "Orchestration"]}
              badges={["Advanced", "Hidden gem"]}
              title="Microsoft AutoGen"
              url="https://github.com/microsoft/autogen"
              meta="GitHub · ~40k stars · Multi-agent conversation framework"
              description="The leading framework for multi-agent systems. Define agents with roles, skills, and tools — then let them converse, delegate, and collaborate to solve complex tasks. Used in real research and production systems."
              learn="You'll learn: multi-agent design patterns, code execution agents, group chat orchestration, agent evaluation."
            />
            <RoadmapCard
              tags={["MCP", "Voice agents", "Production patterns"]}
              badges={["Advanced", "Hidden gem"]}
              title="Awesome LLM Apps"
              url="https://github.com/Shubhamsaboo/awesome-llm-apps"
              meta="GitHub · ~30k stars · 100+ production-ready LLM apps"
              description="A curated, runnable collection of real LLM applications — RAG chatbots, multi-agent teams, voice agents, MCP integrations. Every app has clean code and a README. The best place to study production LLM app patterns."
              learn="You'll learn: agent teams, MCP, voice pipelines, multi-modal agents — with real OpenAI/Anthropic/open-source integrations."
            />
          </>
        )}

        {isVisible("mlops") && <RoadmapSectionHeader title="Phase 4 — MLOps, LLMOps & AI Systems" />}

        {isVisible("mlops") && (
          <>
            <RoadmapCard
              tags={["MLflow", "Ray", "FastAPI", "CI/CD"]}
              badges={["Intermediate"]}
              title="Made With ML (Goku Mohandas)"
              url="https://github.com/GokuMohandas/mlops-course"
              meta="GitHub · ~37k stars · End-to-end MLOps course"
              description="The most production-complete free MLOps resource. Covers data versioning, testing, CI/CD, model serving via APIs, monitoring, and reproducibility — all wired together in a real LLM tagging project. Industry engineers call this the gold standard."
              learn="You'll learn: DVC, MLflow, Ray, Anyscale, FastAPI serving, CI/CD with GitHub Actions, responsible AI."
            />
            <RoadmapCard
              tags={["MLflow", "Prefect", "Evidently AI", "AWS"]}
              badges={["Intermediate"]}
              title="MLOps Zoomcamp — DataTalks.Club"
              url="https://github.com/DataTalksClub/mlops-zoomcamp"
              meta="GitHub · ~12k stars · Free 6-module course with certificate"
              description="Free, cohort-based (also self-paced) MLOps course. Build a complete ML pipeline: experiment tracking → orchestration → deployment → monitoring. Real tools, real data (NYC taxi), certificate on completion."
              learn="You'll learn: MLflow, Mage/Prefect orchestration, batch/streaming deployment, Evidently AI monitoring, Docker, AWS."
            />
            <RoadmapCard
              tags={["ZenML", "Comet ML", "Fine-tuning", "RAG"]}
              badges={["Advanced"]}
              title="LLM Twin Course — Decoding ML"
              url="https://github.com/decodingml/llm-twin-course"
              meta="GitHub · ~8k stars · Full LLMOps system"
              description="Build a production LLM system end-to-end: data pipelines → fine-tuning → RAG → deployment → monitoring. One of the few resources that covers the full LLMOps lifecycle with real infrastructure (ZenML, Comet, AWS)."
              learn="You'll learn: feature pipelines, fine-tuning pipelines, RAG systems, model deployment, inference monitoring — end to end."
            />
            <RoadmapCard
              tags={["Experiment tracking", "Model registry", "Serving"]}
              badges={["Tool"]}
              title="MLflow Docs"
              url="https://mlflow.org/docs/latest/index.html"
              meta="Open-source · Industry standard · Databricks-backed"
              description="The most widely used ML lifecycle platform. Experiment tracking, model registry, deployment — used in virtually every ML team. If you learn one MLOps tool first, make it MLflow."
            />
            <RoadmapCard
              tags={["Pipelines", "Reproducibility", "Stack-agnostic"]}
              badges={["Tool"]}
              title="ZenML Docs"
              url="https://docs.zenml.io/"
              meta="Open-source · Pipeline orchestration for ML"
              description="Modern, stack-agnostic ML pipeline framework. Define pipelines in pure Python, deploy to Kubeflow, Airflow, AWS, or GCP. The cleanest abstraction for reproducible ML pipelines."
            />
            <RoadmapCard
              tags={["Data drift", "Monitoring", "Reports"]}
              badges={["Tool"]}
              title="Evidently AI"
              url="https://github.com/evidentlyai/evidently"
              meta="GitHub · ~5k stars · Model monitoring"
              description="The standard open-source tool for ML monitoring — data drift, model performance, data quality reports. Integrates with any serving stack. Essential for production ML systems."
            />
            <RoadmapCard
              tags={["Ragas", "vLLM", "LangSmith", "Guardrails"]}
              badges={["Advanced", "Hidden gem"]}
              title="Awesome LLMOps"
              url="https://github.com/InftyAI/Awesome-LLMOps"
              meta="GitHub · Curated LLMOps tool landscape"
              description="The most complete map of the LLMOps toolchain — evaluation frameworks (Ragas, DeepEval), observability (LangSmith, OpenLIT), serving (vLLM, Ollama), orchestration, guardrails. Use this to navigate the tool ecosystem."
              learn="You'll learn: how to evaluate, monitor, trace, serve, and guard LLM applications in production."
            />
          </>
        )}

        {isVisible("ml dl llm agents mlops") && <RoadmapSectionHeader title="Data Engineering for ML" />}
        {isVisible("ml dl llm agents mlops") && (
          <RoadmapCard
            tags={["dbt", "Spark", "Kafka", "BigQuery"]}
            badges={["Intermediate", "Hidden gem"]}
            title="Data Engineering Zoomcamp — DataTalks.Club"
            url="https://github.com/DataTalksClub/data-engineering-zoomcamp"
            meta="GitHub · ~27k stars · Free 9-week course"
            description="Free data engineering course covering the full modern data stack. If you're building ML systems in production, this is the pipeline knowledge you need under you."
            learn="You'll learn: Docker, Terraform, BigQuery, dbt, Spark, Kafka, batch and streaming pipelines."
          />
        )}

        {isVisible("ml dl llm agents mlops") && <RoadmapSectionHeader title="Essential tools & papers to know" />}
        {isVisible("llm") && (
          <RoadmapCard
            tags={["Paper", "Transformers", "Attention"]}
            badges={["Advanced"]}
            title="Attention is All You Need (Vaswani et al., 2017)"
            url="https://arxiv.org/abs/1706.03762"
            meta="arXiv · The transformer paper · Must-read"
            description="The foundational paper behind every modern LLM. Short, dense, and worth reading once you've built a transformer from scratch with Karpathy's course — it'll suddenly all make sense."
          />
        )}
        {isVisible("ml dl llm") && (
          <RoadmapCard
            tags={["SOTA", "Benchmarks", "Research"]}
            badges={["Advanced", "Hidden gem"]}
            title="Papers with Code"
            url="https://paperswithcode.com/"
            meta="paperswithcode.com · State-of-the-art benchmarks + code"
            description="Every major ML paper linked to its implementation. Benchmark leaderboards, method comparisons, dataset links. The fastest way to understand what's actually state-of-the-art in any domain."
          />
        )}
        {isVisible("llm mlops") && (
          <>
            <RoadmapCard
              tags={["Serving", "PagedAttention", "OpenAI API compat"]}
              badges={["Tool"]}
              title="vLLM"
              url="https://github.com/vllm-project/vllm"
              meta="GitHub · ~42k stars · High-throughput LLM serving engine"
              description="The industry-standard engine for serving LLMs in production. PagedAttention enables 24x higher throughput than naive serving. If you're deploying any open-source LLM, you're likely using vLLM."
            />
            <RoadmapCard
              tags={["Local inference", "OpenAI compat", "Dev tool"]}
              badges={["Tool"]}
              title="Ollama"
              url="https://github.com/ollama/ollama"
              meta="GitHub · ~130k stars · Local LLM runtime"
              description="Run LLMs locally with one command. Supports Llama 3, Qwen, Mistral, Phi, Gemma, and more. Essential for local development, testing RAG pipelines, and building without API costs."
            />
          </>
        )}

        <hr className="my-6 border-border/50" />

        <RoadmapSectionHeader title="Suggested hands-on projects (milestone-based)" />
        <RoadmapProjectGrid>
          <RoadmapProjectCard num="01" title="Titanic → House Prices pipeline" desc="Full sklearn pipeline: EDA, feature engineering, model selection, cross-validation. Deploy with FastAPI." />
          <RoadmapProjectCard num="02" title="Build GPT from scratch" desc="Follow Karpathy's nanoGPT. Train a character-level transformer on a text corpus. Understand every weight." />
          <RoadmapProjectCard num="03" title="RAG system over your own docs" desc="Ingest PDFs → chunk → embed → store in Chroma/FAISS → query with LlamaIndex. Add reranking." />
          <RoadmapProjectCard num="04" title="Fine-tune a small LLM" desc="Use QLoRA on a 7B model (Llama/Qwen) for a custom task. Track with MLflow. Evaluate with Ragas." />
          <RoadmapProjectCard num="05" title="Multi-agent research assistant" desc="Build a 3-agent team with AutoGen: planner, researcher (web tools), writer. Add memory + persistence." />
          <RoadmapProjectCard num="06" title="Full MLOps pipeline" desc="Orchestrate training with ZenML/Prefect, track with MLflow, serve with FastAPI, monitor with Evidently." />
        </RoadmapProjectGrid>
      </div>
    </div>
  );
}
