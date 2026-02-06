# ADL-Assignment2
# 🎨 Face Generation & Modification using Generative Models
## Advanced Deep Learning - Assignment 2

---

## 📚 Notebook Overview

This comprehensive notebook implements and compares **6 generative models** for facial image generation and modification using the CelebA dataset:

1. **VAE** - Vanilla Variational Autoencoder
2. **β-VAE (β=2.0)** - Beta-VAE with moderate disentanglement
3. **β-VAE (β=4.0)** - Beta-VAE with balanced trade-off
4. **β-VAE (β=10.0)** - Beta-VAE with maximum interpretability
5. **VQ-VAE** - Vector Quantized VAE with discrete latent space
6. **DCGAN** - Deep Convolutional GAN

## 🎯 Key Features

### Core Capabilities
- ✅ **Attribute-Based Filtering**: Train on CelebA subsets (40 attributes)
- ✅ **Interactive Web Dashboard**: Flask UI for model training and monitoring
- ✅ **Comprehensive Analysis**: Multi-β comparison, latent traversal, metrics
- ✅ **Face Generation**: Generate new faces from all models
- ✅ **Attribute Modification**: Modify facial attributes (smile, gender, age, etc.)
- ✅ **Latent Space Exploration**: Interpolation, arithmetic, traversal
- ✅ **Quantitative Evaluation**: PSNR, SSIM, FID, Inception Score, disentanglement

### Advanced Features
- 🔬 **β-VAE Analysis Toolkit**: Latent dimension identification, disentanglement metrics
- 🎭 **Two-Stage Generation**: VQ-VAE + PixelCNN autoregressive prior
- 🎨 **Real-time Training**: Background job queue with status monitoring
- 📊 **Comprehensive Evaluation**: Multi-model comparison with radar charts

---

## 📋 Cell Structure & Dependencies

### Cell 1: Core Setup & Configuration
- **Purpose**: Foundation - imports, config, dataset, data loading
- **Dependencies**: None (run first!)
- **Outputs**: `Config`, `CelebADataset`, `get_celeba_dataloader()`
- **Run Time**: <1 minute

### Cell 2: Convolutional VAE & Beta-VAE
- **Purpose**: VAE/β-VAE models, training, demos
- **Dependencies**: Cell 1
- **Outputs**: `ConvVAE`, `train_vae()`, demo functions
- **Run Time**: <1 minute (definitions only)

### Cell 3: β-VAE Advanced Analysis Toolkit
- **Purpose**: Multi-β training, latent traversal, disentanglement analysis
- **Dependencies**: Cells 1, 2
- **Outputs**: Analysis functions, comparison utilities
- **Run Time**: <1 minute (definitions only)

### Cell 3.1: β-VAE Analysis Execution
- **Purpose**: Load and analyze pre-trained β-VAE models
- **Dependencies**: Cells 1, 2, 3, **pre-trained models in ./logs/**
- **Outputs**: Latent traversals, attribute analysis, comparison plots
- **Run Time**: 2-5 minutes (depends on analysis depth)

### Cell 4: VQ-VAE + PixelCNN Prior
- **Purpose**: Vector quantized VAE with autoregressive prior
- **Dependencies**: Cells 1, 2 (for TrainingLogger)
- **Outputs**: `VQVAE`, `PixelCNN`, training/generation functions
- **Run Time**: <1 minute (definitions only)

### Cell 5: DCGAN
- **Purpose**: Deep Convolutional GAN
- **Dependencies**: Cells 1, 2 (for TrainingLogger)
- **Outputs**: `Generator`, `Discriminator`, `train_dcgan()`
- **Run Time**: <1 minute (definitions only)

### Cell 6: Interactive Web Dashboard ⭐
- **Purpose**: Flask UI for training all models
- **Dependencies**: Cells 1-5 (all model definitions)
- **Outputs**: Web server at http://127.0.0.1:6060
- **Run Time**: Runs until stopped (Ctrl+C)
- **Note**: **MAIN INTERFACE** - use this to train models!

### Cell 7: Comprehensive Evaluation & Comparison
- **Purpose**: Compare all 6 models quantitatively and visually
- **Dependencies**: Cells 1-6, **trained models in ./logs/**
- **Outputs**: Comparison plots, metrics, radar charts
- **Run Time**: 5-15 minutes (depends on number of models)

---

## 🚀 Quick Start Guide

### Option 1: Train from Scratch (Full Pipeline)
```python
# Step 1: Setup (Cell 1)
→ Run Cell 1 to import libraries and setup dataset

# Step 2: Load Model Definitions (Cells 2-5)
→ Run Cells 2, 3, 4, 5 (just definitions, fast)

# Step 3: Train Models via Web UI (Cell 6) ⭐ RECOMMENDED
→ Run Cell 6 to start Flask dashboard
→ Open http://127.0.0.1:6060 in browser
→ Submit training jobs for desired models
→ Optional: Use attribute filtering for custom datasets

# Step 4: Analysis (Cell 3.1 for β-VAE, Cell 7 for all models)
→ Run Cell 3.1 for detailed β-VAE analysis
→ Run Cell 7 for comprehensive 6-model comparison
```

### Option 2: Quick Demo (Use Pre-trained Models)
```python
# If you have pre-trained models in ./logs/:
→ Run Cells 1, 2, 3, 4, 5 (setup)
→ Run Cell 3.1 (β-VAE analysis on existing models)
→ Run Cell 7 (full comparison on existing models)
```

---

## 📊 Expected Outputs

### From Training (Cell 6)
```
./logs/
  VAE/[TIMESTAMP]/
    checkpoints/best_model.pt, final_model.pt
    samples/epoch_*.png
    training_history.json
  
  BetaVAE_beta2.0/[TIMESTAMP]/...
  BetaVAE_beta4.0/[TIMESTAMP]/...
  BetaVAE_beta10.0/[TIMESTAMP]/...
  
  DCGAN/[TIMESTAMP]/...
  VQ-VAE/[TIMESTAMP]/...
  
  Multi_BetaVAE_Comparison/[TIMESTAMP]/
    comparison_report.json
    beta_tradeoff_comparison.png
    latent_traversal_comparison.png
```

### From Evaluation (Cell 7)
- Training loss curves (all models)
- Reconstruction comparison grid
- Generation quality comparison
- Latent interpolation sequences
- β-VAE trade-off plot
- Performance radar chart (6 models)
- Metrics summary JSON

---

## ⚙️ Configuration & Hyperparameters

### Global Settings (Cell 1 - Config class)
```python
IMAGE_SIZE = 64              # CelebA image resolution
IMAGE_CHANNELS = 3           # RGB
LATENT_DIM = 128            # VAE/β-VAE latent dimension
BATCH_SIZE = 128            # Training batch size
LEARNING_RATE = 1e-4        # Adam learning rate
```

### Model-Specific
- **VAE/β-VAE**: β ∈ {1.0, 2.0, 4.0, 10.0}
- **VQ-VAE**: Codebook size K=512, embedding dim=64
- **DCGAN**: Latent dim=100, lr_g=2e-4, lr_d=2e-4, β₁=0.5

### Training (Default)
- **Epochs**: 50 (VAE/β-VAE), 30 (VQ-VAE), 50 (DCGAN)
- **Device**: Auto-detect (CUDA if available, else CPU)
- **Checkpointing**: Every 10 epochs + best model

---

## 📈 Model Comparison Summary

| Model | Reconstruction | Generation | Disentanglement | Speed | Best For |
|-------|---------------|------------|-----------------|-------|----------|
| VAE | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | General purpose |
| β-VAE (β=2) | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | **Best balance** |
| β-VAE (β=4) | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Interpretability |
| β-VAE (β=10) | ⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Max disentangle |
| VQ-VAE | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | **Best quality** |
| DCGAN | N/A | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ | **Fastest gen** |

---

## 💡 Tips & Best Practices

### For Training:
- Start with 10-20 epochs for quick experiments
- Use full 50 epochs for publication-quality results
- GPU strongly recommended (20x faster than CPU)
- Filtered training: Use 30-50% dataset for faster iteration

### For Analysis:
- Run Cell 3.1 after β-VAE training for detailed insights
- Run Cell 7 once all models are trained
- Compare models on same dataset (filtered or full)

### For Debugging:
- Check `./logs/[MODEL]/[TIMESTAMP]/training_history.json` for loss curves
- View samples in `./logs/[MODEL]/[TIMESTAMP]/samples/` during training
- Use dashboard Queue Status to monitor jobs

---

## 🔧 Troubleshooting

**Problem**: Cell 6 blocks execution  
**Solution**: This is expected - Flask server runs until stopped (Ctrl+C)

**Problem**: No models found in Cell 7  
**Solution**: Train models first using Cell 6

**Problem**: Out of memory  
**Solution**: Reduce `BATCH_SIZE` in Cell 1 Config class

**Problem**: Slow training  
**Solution**: Ensure GPU is available (`torch.cuda.is_available()`)

---

## 📝 Citation & Dataset

**CelebA Dataset**: Large-scale CelebFaces Attributes Dataset  
- 202,599 face images
- 40 binary attributes per image
- 64×64 center-cropped and aligned

**Models Implemented**: VAE, β-VAE, VQ-VAE, DCGAN  
**Framework**: PyTorch 2.0+

---

## 🎓 Learning Objectives

By the end of this notebook, you will understand:
- ✅ How VAEs encode images into latent representations
- ✅ The β-VAE trade-off: reconstruction quality vs disentanglement
- ✅ Discrete latent spaces (VQ-VAE) and autoregressive priors
- ✅ GAN training dynamics and adversarial loss
- ✅ Quantitative evaluation metrics for generative models
- ✅ Practical deployment via web interfaces

---

**Ready to start? Run Cell 1 below!** ⬇️